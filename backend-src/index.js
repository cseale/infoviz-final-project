'use strict';

const express = require('express');
const app = express();
const port = 3000;

const elasticsearch = require('elasticsearch');

/**
 *
 * @type {Client}
 */
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});


app.use(express.json());

app.get('/countries', (req, res, next) => {
  let { startYear, endYear, isoCode, associations } = req.query;
  let filter = [];
  if (startYear || endYear) {
    filter.push({
      'range': {
        'year': {
          'gte': startYear,
          'lte': endYear
        }
      }
    });
  }

  if (isoCode) {
    filter.push(Array.isArray(isoCode) ? {
      'terms': {
        'FIELD': isoCode
      }
    } : {
      'term': {
        'sourceCountryId': {
          'value': isoCode
        }
      }
    });
  }

  let query;
  if (filter.length) {
    query = {
      'bool': {
        filter
      }
    };
  }

  client.search({
    index: 'migration',
    type: '_doc',
    body: {
      'size': 0,
      query,
      'aggs': {
        'country_join': {
          'terms': {
            'field': 'sourceCountryId',
            'size': 999999
          },
          'aggs': {
            'year_join': {
              'terms': {
                'field': 'year',
                'size': 999999
              },
              'aggs': {
                'sum': {
                  'sum': {
                    'field': 'value'
                  }
                },
                'result': {
                  'top_hits': {
                    'size': 1,
                    '_source': ['year', 'sourceCountryName', 'sourceCountryCC', 'sourceCountryId']
                  }
                }
              }
            }
          }
        }
      }
    }
  }, (err, result) => {
    if (err) {
      return next(err);
    }

    let ret = [];
    let years = [],
      countries = [],
      elements = new Map();
    if (result.hits.total) {
      for (let countryBucket of result.aggregations.country_join.buckets) {
        let container;
        if (associations) {
          countries.push(countryBucket.key);
          container = new Map();
          elements.set(countryBucket.key, container);
        }
        for (let yearBucket of countryBucket.year_join.buckets) {
          let value = yearBucket.sum.value;
          let elementSource = yearBucket.result.hits.hits[0]._source;
          let element = {
            countryId: elementSource.sourceCountryId,
            year: elementSource.year,
            countryName: elementSource.sourceCountryName,
            countryCC: elementSource.sourceCountryCC,
            value: elementSource.value,
            associations: {},
          };
          element.value = value;

          if (associations) {
            years.push(element.year);
            container.set(element.year, element);
          }

          ret.push(element);
        }
      }
    }

    if (associations) {
      if (!Array.isArray(associations)) {
        associations = [associations];
      }

      client.search({
        index: associations,
        type: '_doc',
        size: 9999,
        body: {
          'query': {
            'bool': {
              'filter': [{
                'terms': {
                  'countryId': countries
                }
              }, {
                'terms': {
                  'year': years
                }
              }]
            }
          }
        }
      }, (err, result) => {
        if (err) {
          return next(err);
        }

        for (let element of result.hits.hits) {
          let container = elements.get(element._source.countryId)
            .get(element._source.year);
          if (container) {
            container.associations[element._index] = { value: element._source.value };
          }
        }

        res.send(ret);
      });
    } else {
      res.send(ret);
    }
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
