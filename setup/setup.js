'use strict';

process.chdir(__dirname); // make sure we are running in the current directory


const elasticsearch = require('elasticsearch');
const csv = require('csvtojson');
let tasks = [];
let nameToCode = require('../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/nameToCode');

const { byCC, byName, byId3 } = require('../res/codes.js');


/**
 *
 * @type {Client}
 */
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

client.indices.create({
    index: 'migration_total',
    body: {
      'settings': {
        'number_of_shards': 1
      },
      'mappings': {
        '_doc': {
          'properties': {
            'associations': {
              'type': 'nested',
              'properties': {
                'name': {
                  'type': 'keyword'
                },
                'value': {
                  'type': 'float'
                }
              }
            },
            'countryCC': {
              'type': 'integer'
            },
            'countryId': {
              'type': 'keyword'
            },
            'countryName': {
              'type': 'keyword'
            },
            'inflow': {
              'properties': {
                'total': {
                  'type': 'integer'
                },
                'male': {
                  'type': 'integer'
                },
                'female': {
                  'type': 'integer'
                },
                'both': {
                  'properties': {
                    'female': {
                      'type': 'integer'
                    },
                    'male': {
                      'type': 'integer'
                    },
                    'total': {
                      'type': 'integer'
                    }
                  }
                },
                'citizens': {
                  'properties': {
                    'female': {
                      'type': 'integer'
                    },
                    'male': {
                      'type': 'integer'
                    },
                    'total': {
                      'type': 'integer'
                    }
                  }
                },
                'foreign family': {
                  'properties': {
                    'total': {
                      'type': 'integer'
                    }
                  }
                },
                'foreign others': {
                  'properties': {
                    'total': {
                      'type': 'integer'
                    }
                  }
                },
                'foreign workers': {
                  'properties': {
                    'female': {
                      'type': 'integer'
                    },
                    'male': {
                      'type': 'integer'
                    },
                    'total': {
                      'type': 'integer'
                    }
                  }
                },
                'foreigners': {
                  'properties': {
                    'female': {
                      'type': 'integer'
                    },
                    'male': {
                      'type': 'integer'
                    },
                    'total': {
                      'type': 'integer'
                    }
                  }
                }
              }
            },
            'outflow': {
              'properties': {
                'total': {
                  'type': 'integer'
                },
                'male': {
                  'type': 'integer'
                },
                'female': {
                  'type': 'integer'
                },
                'both': {
                  'properties': {
                    'female': {
                      'type': 'integer'
                    },
                    'male': {
                      'type': 'integer'
                    },
                    'total': {
                      'type': 'integer'
                    }
                  }
                },
                'citizens': {
                  'properties': {
                    'female': {
                      'type': 'integer'
                    },
                    'male': {
                      'type': 'integer'
                    },
                    'total': {
                      'type': 'integer'
                    }
                  }
                },
                'foreigners': {
                  'properties': {
                    'female': {
                      'type': 'integer'
                    },
                    'male': {
                      'type': 'integer'
                    },
                    'total': {
                      'type': 'integer'
                    }
                  }
                }
              }
            },
            'year': {
              'type': 'integer'
            }
          }
        }
      }
    }
  }, (err, res) => {
    if (err) {
      throw err;
    }
    for (let p of [
      {
        path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Outflow.csv',
        name: 'outflow'
      }
      ,
      {
        path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Inflow-part-a.csv',
        name: 'inflow'
      },
      {
        path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Inflow-part-b.csv',
        name: 'inflow'
      }
    ]) {

      csv()
        .fromFile(p.path)
        .subscribe((json) => {
          try {
            let countryId = json['Country codes -UN based-'],
              year = json['Year'],
              id = countryId + year,
              data = {};

            let cov = json['Coverage -Citizens/Foreigners/Both-'].toLowerCase()
                .trim(),
              sex = json['Gender'].toLowerCase()
                .trim();

            data[cov] = {};
            let val = +json['Value'];
            data[cov][sex] = val;
            data[cov].total = val;
            data.total = val;
            data[sex] = val;
            tasks.push({
              update: {
                _index: 'migration_total',
                _type: '_doc',
                _id: id,
                'retry_on_conflict': 3
              }
            });

            let doc = {
              year,
              countryId,
              countryName: json['COUNTRIES'],
              countryCC: json['UN numeric code'],
              associations: []
            };

            let d = {
              'script': {
                'source': `
                try {
                if (!ctx._source[params.name])
                              ctx._source[params.name] = new HashMap();
                }
                catch (RuntimeException e) {
                  ctx._source[params.name] = new HashMap();
                }
                 try {
                  if (ctx._source[params.name][params.cov] == null)
                  ctx._source[params.name][params.cov] = new HashMap();
                 }catch (RuntimeException e) {
                ctx._source[params.name][params.cov] = new HashMap();
                }
                 
                 try {
                  if (ctx._source[params.name][params.cov][params.sex])
                    ctx._source[params.name][params.cov][params.sex] = 0;
                  } catch (RuntimeException e) {
                ctx._source[params.name][params.cov][params.sex] = 0;
                }
                              
                          ctx._source[params.name][params.cov][params.sex] += params.param1;
                          
                          try {
                          if (!ctx._source[params.name].total)
                              ctx._source[params.name].total = 0;
                          }
                          catch (RuntimeException e) {
                            ctx._source[params.name].total = 0;
                          }
                          ctx._source[params.name].total += params.param1;
                          
                          if (params.sex != 'total') {
                            try {
                            if (!ctx._source[params.name][params.sex])
                                ctx._source[params.name][params.sex] = 0;
                            }
                            catch (RuntimeException e) {
                              ctx._source[params.name][params.sex] = 0;
                            }
                            ctx._source[params.name][params.sex] += params.param1;
                            
                            
                            try {
                            if (!ctx._source[params.name][params.cov].total)
                                ctx._source[params.name][params.cov].total = 0;
                            }
                            catch (RuntimeException e) {
                              ctx._source[params.name][params.cov].total = 0;
                            }
                            ctx._source[params.name][params.cov].total += params.param1;

                          }
                          `,
                'lang': 'painless',
                'params': {
                  'param1': +json['Value'],
                  cov,
                  sex,
                  name: p.name,
                  doc
                }
              },
              upsert: {
                year,
                countryId,
                countryName: json['COUNTRIES'],
                countryCC: json['UN numeric code'],
                associations: []
              }
            };
            d.upsert[p.name] = data;
            tasks.push(
              d
            );
          } catch (e) {
            console.error(e);
          }
        });
    }
  }
);
let times = 0;
startWorkers();

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
