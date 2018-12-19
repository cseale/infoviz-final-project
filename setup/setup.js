'use strict';

process.chdir(__dirname); // make sure we are running in the current directory


const elasticsearch = require('elasticsearch');
const csv = require('csvtojson');
let tasks = [];

const { byName } = require('../res/codes.js');

/**
 *
 * @type {Client}
 */
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

/**
 * This contains the ES mapping.
 *
 * The basic properties we used are:
 *  keyword -> used to index the full string for querying
 *  float/integer -> query for lower than equals, etc
 *  properties -> index as object
 *  properties.enabled = false -> disable indexing of the properties
 *  properties.nested -> index as almost separate documents so we can query on the properties independently
 *
 * For in detail information regarding each type on option please
 * consult the official documentation https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
 */
client.indices.create({
    index: 'migration_total',
    body: {
      'settings': {
        // we unfortunately don't own a massive server cloud to afford multiple shards :)
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
              // This property is way too dynamic and big for Elasticsearch to handle in a single
              // document. Disable all indexing on it
              'enabled': false,
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
            'netflow': {
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
      // if erred crash the process, we can not recover from this
      throw err;
    }

    // loop over the CSVs
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
      },
      {
        path: '../datasets/Bi-Lateral Migration 1945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Netflow.csv',
        name: 'netflow'
      }
    ]) {

      // load each CSV and process it line by line so we don't run out of RAM
      csv()
        .fromFile(p.path)
        .subscribe((json) => {
          // let the fun start :)

          let reportingCountryId,
            reportingCountry;
          try {
            // this stupid csv handler hides the errors...
            // calculate the metadata
            let countryId = json['Country codes -UN based-'].trim(),
              year = +json['Year'],
              // this will provide a unique id where we can merge documents
              id = countryId + year,
              data = {};

            // calculate the reporter metadata
            let reportingCountryName = json['Reporting country'];

            // if we own metadata regarding that country
            // you would be surprised how much trash this filters
            if (byName[reportingCountryName]) {
              reportingCountryId = byName[reportingCountryName].id3;
              reportingCountry = {
                countryName: reportingCountryName,
                countryId: reportingCountryId,
                countryCC: byName[reportingCountryName].cc,
              };
            }

            // calculate the value metadata
            // fortunately we use NodeJs and Painless so this is very easy to write :)
            let cov = json['Coverage -Citizens/Foreigners/Both-'].toLowerCase()
                .trim(),
              sex = json['Gender'].toLowerCase()
                .trim();

            // if this is the first document of this id we need to add it to ES
            // else we need to aggregate the data to the existing document

            // because we don't know if the current document is the first for this id we need
            // to build both flows and let ES decide which to take or else we will
            // have big race problems

            // build the data objects
            data[cov] = {};
            let val = +json['Value'];
            data[cov][sex] = val;
            data[sex] = val;

            // use the update rest endpoint with retries to fix version conflict problems
            tasks.push({
              update: {
                _index: 'migration_total',
                _type: '_doc',
                _id: id,
                'retry_on_conflict': 3
              }
            });

            // calculate the document
            let doc = {
              year,
              countryId,
              countryName: json['COUNTRIES'].trim(),
              countryCC: json['UN numeric code'].trim(),
              associations: []
            };

            let d = {
              // this was fun to write, apparently Painless(the script language) is a misleading name :)
              // it was very painful to write...
              // unfortunately I can't add comments inside for performance reasons
              // basically what this does is make sure we have an initialized structure and we add
              // the current value in all the corresponding places(inflow.foreigners.male gets added
              // to the segmented data too)
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
                          
                  if (container[params.name][params.sex] == null)
                      container[params.name][params.sex] = 0;
                  
                  container[params.name][params.sex] += params.param1;

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
                            
                    if (container[params.name][params.sex] == null)
                        container[params.name][params.sex] = 0;
                    
                    container[params.name][params.sex] += params.param1;
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
                // this gets called if the document is missing
                year,
                countryId,
                countryName: json['COUNTRIES'].trim(),
                countryCC: json['UN numeric code'].trim(),
                associations: [],
              }
            };
            d.upsert[p.name] = data;
            if (reportingCountry && reportingCountryId) {
              // if we have reportingCountry data add this too
              d.upsert.reportingCountry = {};
              d.upsert.reportingCountry[reportingCountryId] = {};

              // clone our data object because we have a small change to do
              Object.assign(d.upsert.reportingCountry[reportingCountryId], reportingCountry);
              d.upsert.reportingCountry[reportingCountryId][p.name] = data;
            }
            tasks.push(
              d
            );
          } catch (e) {
            // actually print them
            console.error(e);
          }
        });
    }
  }
);
let times = 0;
startWorkers();

// worker pool
function startWorkers() {
  times = 0;
  setTimeout(() => {
    for (var i = 0; i < 10; i++) {
      bulkThread();
    }
  }, 2000);
}

// worker handler
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
    console.log('Done');
    if (times++ < 100) {
      setTimeout(bulkThread, 1000);
    }
  }
}
