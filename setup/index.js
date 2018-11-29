'use strict';

process.chdir(__dirname); // make sure we are running in the current directory


const elasticsearch = require('elasticsearch');
const csv = require('csvtojson');
let tasks = [];
let nameToCode = require('../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/nameToCode');

function loadFromObj(obj, name) {
  return function (row) {
    return obj[row[name]];
  };
}

const mapping = {
  migration: {
    descriptor: {
      reportingCountryName: 'Reporting country',
      reportingCountryId: loadFromObj(nameToCode, 'Reporting country'),
      sourceCountryName: 'COUNTRIES',
      sourceCountryId: 'UN numeric code',
      coverage: 'Coverage -Citizens/Foreigners/Both-',
      gender: 'Gender',
      year: '+Year',
      value: '+Value'
    },
    path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Outflow.csv'
  }
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

  for (let esProperty in descriptor) {
    let mapping;
    if (esProperty[0] === '+') {
      mapping = { 'type': 'integer' };
    } else {
      mapping = { 'type': 'keyword' };
    }

    properties[esProperty] = mapping;
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

        let esPack = {};

        for (let esProperty in descriptor) {
          let jsonProperty = descriptor[esProperty];
          let value;
          let transform;
          if (jsonProperty[0] === '+') {
            jsonProperty = jsonProperty.slice(1);
            transform = Number;
          }

          value = json[jsonProperty];

          if (transform) {
            value = transform(value);
          }

          esPack[esProperty] = value;
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
      });
  });
}

let times = 0;

setTimeout(() => {
  for (var i = 0; i < 50; i++) {
    bulkThread();
  }
}, 1000);

function bulkThread() {
  let body = tasks.slice(0, 300);
  if (body.length) {
    times = 0;
    client.bulk({ body }, function (err, response) {
      if (err) {
        console.error(err);
      }

      bulkThread();

    });
  } else {
    if (times++ < 30) {
      setTimeout(bulkThread, 1000);
    }
  }
}
