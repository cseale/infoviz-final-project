'use strict';

process.chdir(__dirname); // make sure we are running in the current directory

const RUN_IN_PIPE = false;

if (RUN_IN_PIPE) {
  // start the main index
  require('./setup');
}

const elasticsearch = require('elasticsearch');
const csv = require('csvtojson');
let tasks = [];

/**
 * Row style csvs.
 * @property {function} id The function that calculates the id
 * @property {function} descriptor.name The function that calculates the name
 * @property {function} descriptor.value The function that calculates the value
 * @property {string} path File path
 */
const rowLoader = [
  {
    id: function (json) {
      return json.iso_a3 + new Date(json.date).getFullYear();
    },
    descriptor: {
      name: function () {
        return 'Big mac index';
      },
      value: function (json) {
        return Number(json.adj_price);
      }
    },
    path: '../datasets/Big Mac Index 2011-2018/big-mac-adjusted-index.csv'
  }

];

/**
 * Row style csvs.
 * @property {function} id The function that calculates the id
 * @property {function} descriptor.name The function that calculates the name
 * @property {function} incr The function that calculates the next column based on the current index
 * @property {string} path File path
 * @property {int} start The column to start with
 */
const columnLoader = [
  {
    id: function (json, index) {
      return json['Country Code'] + index;
    },
    descriptor: {
      name: function () {
        return 'Development assistance';
      }
    },
    start: 1960,
    incr: (n) => {
      let ret = +n + 1;

      return ret > 2017 ? null : ret;
    },
    path: '../datasets/Net Development Assistance and Official Aid Recieved 1960-2015/API_DT.ODA.ALLD.CD_DS2_en_csv_v2_10227906.csv'
  },

  {
    id: function (json, index) {
      return json['Country Code'] + index;
    },
    descriptor: {
      name: function () {
        return 'Percent labour female';
      }
    },
    start: 1960,
    incr: (n) => {
      let ret = +n + 1;

      return ret > 2017 ? null : ret;
    },
    path: '../datasets/Labour Force % Women/API_SL.TLF.TOTL.FE.ZS_DS2_en_csv_v2_10227160.csv'
  }
  ,
  {
    id: function (json, index) {
      return json['Country Code'] + index;
    },
    descriptor: {
      name: function (json) {
        return json['Indicator Name'];
      }
    },
    start: 1990,
    incr: (n) => {
      let ret = +n + 1;

      return ret > 2017 ? null : ret;
    },
    path: '../datasets/SDG_csv/SDGData.csv'
  }

];

/**
 *
 * @type {Client}
 */
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

function load() {
  console.log('LOADER CALLED');
  for (let l of rowLoader) {
    let { descriptor, path, id } = l;

    // load the csv file and proces it row by row so we don't run out of RAM
    csv()
      .fromFile(path)
      .subscribe((json) => {
        // triggered on each row
        // push the data in the tasks queue

        // calculate the destination
        tasks.push({
          update: {
            _index: 'migration_total',
            _type: '_doc',
            _id: id(json)
          }
        });

        // calculate the values
        tasks.push({
          // because of the async nature of these tasks we have to run atomically on Elasticsearch
          'script': {
            // assure we have at least a empty array
            'source': `
                  if (ctx._source.associations == null)
                    ctx._source.associations = [];

                  ctx._source.associations.add(params.associations);
                  `,
            // this gets passed in the script
            // we can not format the source with them because ES uses caches for compilation and
            // has a limited number of compilations per minute. This was all of them require a single
            // compilation
            'params': {
              'associations':
                {
                  'name': descriptor.name(json),
                  'value': descriptor.value(json)
                }

            }
          }
        });
      });
  }

  for (let l of columnLoader) {
    let { descriptor, path, id, start, incr } = l;

    csv()
      .fromFile(path)
      .subscribe((json) => {
        let index = start;

        do {
          let value = json[index];
          if (!value) {
            continue;
          }
          tasks.push({
            update: {
              _index: 'migration_total',
              _type: '_doc',
              _id: id(json, index)
            }
          });
          tasks.push({
            // because of the async nature of these tasks we have to run atomically on Elasticsearch
            'script': {
              // assure we have at least a empty array
              'source': `
                  if (ctx._source.associations == null)
                    ctx._source.associations = [];

                  ctx._source.associations.add(params.associations);
                  `,
              'params': {
                // this gets passed in the script
                // we can not format the source with them because ES uses caches for compilation and
                // has a limited number of compilations per minute. This was all of them require a single
                // compilation
                'associations':
                  {
                    'name': descriptor.name(json),
                    'value': typeof descriptor.value == 'function' ? descriptor.value(value) : +value
                  }

              }
            }
          });
        } while ((index = incr(index)) != null);

      });
  }

  // start the worker pool
  startWorkers();
}

// used to determine when no now tasks have occurred
let times = 0;

// start worker pool
function startWorkers() {
  times = 0;

  // let a little processing time before the workers start
  setTimeout(() => {
    for (var i = 0; i < 10; i++) {
      bulkThread();
    }
  }, 2000);
}


/**
 * Worker handler
 */
function bulkThread() {
  // run in bulks of 300
  let body = tasks.splice(0, 300);
  if (body.length) {
    // if we have things to do

    // reset the processing timer
    times = 0;

    // call es
    client.bulk({ body }, function (err, response) {
      if (err) {
        // this should never happen
        console.error(err);
      }

      if (response.errors) {
        // this will happen from time to time because our associations have dates that are not
        // present in our migration data
        // log it for assurance purposes
        console.log(JSON.stringify(body));
        console.log(JSON.stringify(response));
        console.log(require('util')
          .inspect(response, {
            depth: null,
            colors: true
          }));

      }

      bulkThread();

    });
  } else {
    console.log('Done');
    // if we are done try to wait for new tasks foe a reasonable amount of times
    if (times++ < 100) {
      setTimeout(bulkThread, 1000);
    }
  }
}

if (RUN_IN_PIPE) {
  // if used in conjunction with the other scripts wait for them to finish first
  // beforeExit is triggered when the even loop is empty
  process.once('beforeExit', load);
} else {
  load();
}

