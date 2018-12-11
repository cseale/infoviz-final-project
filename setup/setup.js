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
            'reportingCountry': {
              'properties': {}
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
      },
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
          let reportingCountryId,
            reportingCountry;
          try {
            let countryId = json['Country codes -UN based-'].trim(),
              year = +json['Year'],
              id = countryId + year,
              data = {};

            let reportingCountryName = json['Reporting country'];
            if (byName[reportingCountryName]) {
              reportingCountryId = byName[reportingCountryName].id3;
              reportingCountry = {
                countryName: reportingCountryName,
                countryId: reportingCountryId,
                countryCC: byName[reportingCountryName].cc,
              };

            }

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
              countryName: json['COUNTRIES'].trim(),
              countryCC: json['UN numeric code'].trim(),
              associations: []
            };

            let d = {
              'script': {
                'source': `
                Map container = ctx._source;
                if (container[params.name] == null)
                              container[params.name] = new HashMap();
                
                  if (container[params.name][params.cov] == null)
                    container[params.name][params.cov] = new HashMap();
                 
                  if (container[params.name][params.cov][params.sex] == null)
                    container[params.name][params.cov][params.sex] = 0;
                              
                  container[params.name][params.cov][params.sex] += params.param1;
                          
                          
                  if (container[params.name].total == null)
                      container[params.name].total = 0;
                      
                  container[params.name].total += params.param1;
                          
                  if (params.sex != 'total') {
                    if (container[params.name][params.sex] == null)
                        container[params.name][params.sex] = 0;
                    
                    container[params.name][params.sex] += params.param1;
                    
                    
                    if (container[params.name][params.cov].total == null)
                        container[params.name][params.cov].total = 0;
                    
                    container[params.name][params.cov].total += params.param1;

                  }

                  if (params['reportingCountry'] != null && params['reportingCountryId'] != null ) {
                    if (container['reportingCountry'] == null)
                      container['reportingCountry'] = new HashMap();
                    if (container['reportingCountry'][params['reportingCountryId']] == null) {
                      container['reportingCountry'][params['reportingCountryId']] = params['reportingCountry'];
                    }
                    
                    container = container['reportingCountry'][params['reportingCountryId']];
                    
                    if (container[params.name] == null)
                      container[params.name] = new HashMap();
                  
                    if (container[params.name][params.cov] == null)
                      container[params.name][params.cov] = new HashMap();
                   
                    if (container[params.name][params.cov][params.sex] == null)
                      container[params.name][params.cov][params.sex] = 0;
                                
                    container[params.name][params.cov][params.sex] += params.param1;
                            
                            
                    if (container[params.name].total == null)
                        container[params.name].total = 0;
                        
                    container[params.name].total += params.param1;
                            
                    if (params.sex != 'total') {
                      if (container[params.name][params.sex] == null)
                          container[params.name][params.sex] = 0;
                      
                      container[params.name][params.sex] += params.param1;
                      
                      
                      if (container[params.name][params.cov].total == null)
                          container[params.name][params.cov].total = 0;
                      
                      container[params.name][params.cov].total += params.param1;
                  }
                  }`,
                'lang': 'painless',
                'params': {
                  'param1': +json['Value'],
                  cov,
                  sex,
                  name: p.name,
                  reportingCountryId,
                  reportingCountry,
                  doc
                }
              },
              upsert: {
                year,
                countryId,
                countryName: json['COUNTRIES'].trim(),
                countryCC: json['UN numeric code'].trim(),
                associations: [],
              }
            };
            d.upsert[p.name] = data;
            if (reportingCountry && reportingCountryId) {
              d.upsert.reportingCountry = {};
              d.upsert.reportingCountry[reportingCountryId] = {};
              Object.assign(d.upsert.reportingCountry[reportingCountryId], reportingCountry);
              d.upsert.reportingCountry[reportingCountryId][p.name] = data;
            }
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
