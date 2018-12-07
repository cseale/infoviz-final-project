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


//
// const mapping = {
//   migration: {
//     descriptor: {
//       reportingCountryName: 'Reporting country',
//       reportingCountryCC: {
//         transform: [trim, loadFromObj(byName, 'cc')],
//         name: 'Reporting country'
//       },
//       reportingCountryId: {
//         transform: [trim, loadFromDoubleObj(byCC, nameToCode, 'id3')],
//         name: 'Reporting country',
//         mapping: { type: 'keyword' }
//       },
//       countryName: 'COUNTRIES',
//       countryCC: {
//         transform: Number,
//         name: 'UN numeric code'
//       },
//       countryId: {
//         name: 'Country codes -UN based-',
//         mapping: { type: 'keyword' }
//
//       },
//       year: {
//         transform: Number,
//         name: 'Year'
//       },
//       outflow: {
//         onlyFor: 'outflow',
//         _obj: {
//           esName: {
//             values: ['both', 'foreigners', 'citizens'],
//             function(json) {
//               return json['Coverage -Citizens/Foreigners/Both-'].toLowerCase()
//                 .trim();
//             }
//           },
//           _obj: {
//             outflow: {
//               transform: Number,
//               name: 'Value',
//               esName: {
//                 values: ['male', 'female', 'total'],
//                 function(json) {
//                   return json['Gender'].toLowerCase()
//                     .trim();
//                 }
//               }
//             }
//           }
//         }
//       },
//       inflow: {
//         onlyFor: 'inflow',
//         _obj: {
//           esName: {
//             values: ['both', 'foreigners', 'citizens'],
//             function(json) {
//               return json['Coverage -Citizens/Foreigners/Both-'].toLowerCase()
//                 .trim();
//             }
//           },
//           _obj: {
//             inflow: {
//               transform: Number,
//               name: 'Value',
//               esName: {
//                 values: ['male', 'female', 'total'],
//                 function(json) {
//                   return json['Gender'].toLowerCase()
//                     .trim();
//                 }
//               }
//             }
//           }
//         }
//       },
//       associations: {
//         mapping: {
//           properties: {
//             name: {
//               type: 'keyword',
//             },
//             value: {
//               type: 'float'
//             }
//
//           },
//           type: 'nested'
//         }
//       }
//     },
//     id: ['countryId', 'year'],
//     update: true,
//     path: [
//       {
//         path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Outflow.csv',
//         name: 'outflow'
//       },
//       {
//         path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Inflow-part-a.csv',
//         name: 'inflow'
//       },
//       {
//         path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Inflow-part-b.csv',
//         name: 'inflow'
//       }
//     ]
//   }
//
// };
//
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
//
// function analiseDescriptor(descriptor) {
//   let properties = {};
//
//   if (descriptor._obj) {
//     let res = analiseDescriptor(descriptor._obj);
//
//     if (descriptor.esName) {
//       for (let e of descriptor.esName.values) {
//         properties[e] = { properties: res };
//       }
//     }
//   } else {
//     for (let esPropertyName in descriptor) {
//       let mapping;
//       let value = descriptor[esPropertyName];
//       if (typeof value === 'string') {
//         mapping = { 'type': 'keyword' };
//       } else {
//         if (typeof value === 'object') {
//           if (value.esName) {
//             esPropertyName = value.esName.values;
//           }
//           if (value._obj) {
//             if (Array.isArray(esPropertyName)) {
//               let res = { properties: analiseDescriptor(value._obj) };
//               for (let e of esPropertyName) {
//                 properties[e] = res;
//               }
//             } else {
//               properties[esPropertyName] = { properties: analiseDescriptor(value._obj) };
//             }
//             continue;
//           }
//         }
//         mapping = value.mapping;
//
//         if (!mapping) {
//           mapping = { 'type': 'integer' };
//         }
//       }
//       if (Array.isArray(esPropertyName)) {
//         for (let e of esPropertyName) {
//           properties[e] = mapping;
//         }
//       } else {
//         properties[esPropertyName] = mapping;
//       }
//     }
//   }
//
//
//   return properties;
// }
//
// function packDescriptor(json, descriptor, pathName) {
//   let esPack = {};
//
//   if (descriptor._obj) {
//     esPack = packDescriptor(json, descriptor._obj, pathName);
//     if (descriptor.esName) {
//       let o = {};
//       o[descriptor.esName.function(json, pathName)] = esPack;
//       esPack = o;
//     }
//   } else {
//     for (let esPropertyName in descriptor) {
//       let value = descriptor[esPropertyName];
//       let ret;
//       if (typeof value === 'string') {
//         ret = json[value];
//       } else {
//         if (typeof value === 'object') {
//           if (value.onlyFor && value.onlyFor !== pathName) {
//             continue;
//           }
//           if (value.esName) {
//             esPropertyName = value.esName.function(json, pathName);
//           }
//           if (value._obj) {
//             esPack[esPropertyName] = packDescriptor(json, value._obj, pathName);
//             continue;
//           }
//         }
//
//         let { transform, name } = value;
//         ret = json[name];
//         if (transform) {
//           if (Array.isArray(transform)) {
//             for (let tr of transform) {
//               ret = tr(ret);
//             }
//           } else {
//             ret = transform(ret);
//           }
//         }
//       }
//
//       esPack[esPropertyName] = ret;
//     }
//   }
//
//   return esPack;
// }

/**
 *
 * @type {Client}
 */
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});
//
// let c = 0;
//
// for (let index in mapping) {
//   c++;
//   let { descriptor, path, update, id, _index } = mapping[index];
//
//   let properties = analiseDescriptor(descriptor);
//   if (_index) {
//     index = _index;
//     go();
//   } else {
//     client.indices.create({
//         index,
//         body: {
//           'settings': {
//             'number_of_shards': 1
//           },
//           'mappings': {
//             '_doc': {
//               properties
//             }
//           }
//         }
//       }, (err, res) => {
//         if (err) {
//           throw err;
//         }
//
//         go();
//       }
//     );
//   }
//
//   // noinspection JSAnnotator
//   function go() {
//     if (!Array.isArray(path)) {
//       path = [path];
//     }
//
//     for (let pathElement of path) {
//       let filePath = pathElement,
//         name;
//       if (typeof pathElement === 'object') {
//         filePath = pathElement.path;
//         name = pathElement.name;
//       }
//
//       csv()
//         .fromFile(filePath)
//         .subscribe((json) => {
//
//           // nameToCode[json['COUNTRIES']] = json['UN numeric code'];
//
//           let esPack = packDescriptor(json, descriptor, name);
//
//           let _id;
//           if (id) {
//             _id = '';
//             for (let e of id) {
//               _id += esPack[e];
//             }
//
//             if (/undefined/.test(_id)) {
//               console.error('Failed to deduce id');
//               console.error(json);
//               console.error(esPack);
//             }
//
//           }
//
//           if (update) {
//             tasks.push({
//               update: {
//                 _index: index,
//                 _type: '_doc',
//                 _id,
//                 "retry_on_conflict" : 3
//               }
//             });
//             tasks.push({
//               doc: esPack,
//               doc_as_upsert: true
//             });
//           } else {
//             tasks.push({
//               index: {
//                 _index: index,
//                 _type: '_doc',
//                 _id
//               }
//             });
//             tasks.push(esPack);
//           }
//
//
//         }, e => {
//           throw e;
//         }, () => {
//           console.log('Index ' + index + ' completed.');
//           // console.log(JSON.stringify(nameToCode));
//         });
//     }
//   }
//
//
// }


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
