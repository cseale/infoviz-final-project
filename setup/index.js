'use strict';

process.chdir(__dirname); // make sure we are running in the current directory


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

const mapping = {
  migration: {
    descriptor: {
      reportingCountryName: 'Reporting country',
      reportingCountryCC: {
        transform: [trim, loadFromObj(byName, 'cc')],
        name: 'Reporting country'
      },
      reportingCountryId: {
        transform: [trim, loadFromDoubleObj(byCC, nameToCode, 'id')],
        name: 'Reporting country',
        mapping: { type: 'keyword' }
      },
      sourceCountryName: 'COUNTRIES',
      sourceCountryCC: { name: 'UN numeric code' },
      sourceCountryId: {
        transform: loadFromObj(byCC, 'id'),
        name: 'UN numeric code',
        mapping: { type: 'keyword' }
      },
      coverage: 'Coverage -Citizens/Foreigners/Both-',
      gender: 'Gender',
      year: {
        transform: Number,
        name: 'Year'
      },
      value: {
        transform: Number,
        name: 'Value'
      }
    },
    path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Outflow.csv'
  },
  big_mac: {
    descriptor: {
      year: {
        transform: function (y) {
          return new Date(y).getFullYear();
        },
        name: 'date'
      },
      value: {
        name: 'adj_price',
        transform : Number,
        mapping: {
          type: 'float'
        }
      },
      countryId : {
        transform: loadFromObj(byId3, 'id'),
        name: 'iso_a3',
        mapping: {
          type: 'keyword'
        }
      },
      countryCC : {
        transform: loadFromObj(byId3, 'cc'),
        name: 'iso_a3',
      },
      countryName : {
        transform: loadFromObj(byId3, 'name'),
        name: 'iso_a3',
        mapping: {
          type: 'keyword'
        }
      }
    },
    path: '../datasets/Big Mac Index 2011-2018/big-mac-adjusted-index.csv'
  },

};

/**
 *
 * @type {Client}
 */
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

let c = 0;

for (let index in mapping) {
  let { descriptor, path } = mapping[index];

  let properties = {};

  for (let esPropertyName in descriptor) {
    let mapping;
    let value = descriptor[esPropertyName];
    if (typeof value === 'string') {
      mapping = { 'type': 'keyword' };
    } else {
      mapping = value.mapping;

      if (!mapping) {
        mapping = { 'type': 'integer' };
      }
    }

    properties[esPropertyName] = mapping;
  }

  client.indices.create({
    index,
    body: {
      'settings': {
        'number_of_shards': 1
      },
      'mappings': {
        '_doc': {
          properties
        }
      }
    }
  }, (err, res) => {
    if (err) {
      throw err;
    }

    csv()
      .fromFile(path)
      .subscribe((json) => {

        // nameToCode[json['COUNTRIES']] = json['UN numeric code'];

        let esPack = {};

        for (let esPropertyName in descriptor) {
          let value = descriptor[esPropertyName];
          let ret;
          if (typeof value === 'string') {
            ret = json[value];
          } else {
            let { transform, name } = value;
            ret = json[name];
            if (transform) {
              if (Array.isArray(transform)) {
                for (let tr of transform) {
                  ret = tr(ret);
                }
              } else {
                ret = transform(ret);
              }
            }
          }

          esPack[esPropertyName] = ret;
        }

        tasks.push({
          index: {
            _index: index,
            _type: '_doc',
          }
        });
        tasks.push(esPack);
      }, e => {
        throw e;
      }, () => {
        console.log('Index ' + index + ' completed.');
        // console.log(JSON.stringify(nameToCode));
      });
  });
}

let times = 0;

setTimeout(() => {
  for (var i = 0; i < 10; i++) {
    bulkThread();
  }
}, 1000);

function bulkThread() {
  let body = tasks.splice(0, 300);
  if (body.length) {
    times = 0;
    // console.log(body);
    client.bulk({ body }, function (err, response) {
      if (err) {
        console.error(err);
      }

      bulkThread();

    });
  } else {
    console.log('Nope');
    if (times++ < 30) {
      setTimeout(bulkThread, 1000);
    }
  }
}
