'use strict';

process.chdir(__dirname); // make sure we are running in the current directory

// start the main index
// require("./setup");

const elasticsearch = require('elasticsearch');
const csv = require('csvtojson');
let tasks = [];
let nameToCode = require('../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/nameToCode');

const { byCC, byName, byId3 } = require('../res/codes.js');

function loadFromObj(obj, property, transform) {
  return function (e) {
    let ret = obj[e];
    if (!ret) {
      // console.error('Undefined value for ' + e);
      return;
    }
    ret = property ? ret[property] : ret;
    if (transform) {
      ret = transform(ret);
    }

    return ret;
  };
}

function loadFromDoubleObj(obj1, obj2, property) {
  return function (e) {
    let ret = obj1[obj2[e]];
    if (!ret) {
      // console.error('Undefined value for ' + e);
      return;
    }
    return property ? ret[property] : ret;
  };
}

function trim(s) {
  return s.trim();
}

const rowLoader = [
  {
  id: function (json) {
    return json.iso_a3 + new Date(json.date).getFullYear();
  },
  descriptor: {
    name: function () {
      return 'big_mac';
    },
    value: function (json) {
      return Number(json.adj_price);
    }
  },
  path: '../datasets/Big Mac Index 2011-2018/big-mac-adjusted-index.csv'
}

];

const collumnLoader = [
  {
    id: function (json) {
      return json.iso_a3 + new Date(json.date).getFullYear();
    },
    descriptor: {
      name: function () {
        return 'big_mac';
      },
      value: function (json) {
        return Number(json.adj_price);
      }
    },
    path: '../datasets/Big Mac Index 2011-2018/big-mac-adjusted-index.csv'
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
    let { descriptor, path, id, _index } = l;

    csv()
      .fromFile(path)
      .subscribe((json) => {
        tasks.push({
          update: {
            _index: 'migration_total',
            _type: '_doc',
            _id: id(json)
          }
        });
        tasks.push({

          'script': {
            'source': `
                      if (ctx._source.associations == null)
                  ctx._source.associations = [];

                  ctx._source.associations.add(params.associations);
                  `,
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
  startWorkers();
}

let times = 0;

// startWorkers();

function startWorkers() {
  times = 0;
  setTimeout(() => {
    for (var i = 0; i < 10; i++) {
      bulkThread();
    }
  }, 2000);
}


function bulkThread() {
  let body = tasks.splice(0, 300);
  if (body.length) {
    times = 0;
    client.bulk({ body }, function (err, response) {
      if (err) {
        console.error(err);
      }

      if (response.errors) {
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
    console.log('Nope');
    if (times++ < 100) {
      setTimeout(bulkThread, 1000);
    }
  }
}

process.once('beforeExit', load);
