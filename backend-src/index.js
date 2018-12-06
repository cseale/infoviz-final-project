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
  client.search({
    index: 'migration_total',
    type: '_doc',
    body: {
      'size': 0,
      'aggs': {
        'country_name': {
          'terms': {
            'field': 'countryId',
            'size': 9999
          },
          'aggs': {
            'hits': {
              'top_hits': {
                'size': 1,
                '_source': ['countryName', 'countryId']
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
    for (let e of result.aggregations.country_name.buckets) {
      let hit = e.hits.hits.hits[0]._source;

      ret.push(hit);
    }

    res.send(ret);
  });
});

app.get('/countryStats', (req, res, next) => {
  let { startYear, endYear, isoCode, associations } = req.query;

  if (associations) {
    if (!Array.isArray(associations)) {
      associations = [associations];
    }
  }
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
        'countryId': {
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
    index: 'migration_total',
    type: '_doc',
    body: {
      'size': 9999,
      query
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
      ret = result.hits.hits.map(e => e._source);
    }

    // if (associations) {
    //   if (!Array.isArray(associations)) {
    //     associations = [associations];
    //   }
    //
    //   client.search({
    //     index: associations,
    //     type: '_doc',
    //     size: 9999,
    //     body: {
    //       'query': {
    //         'bool': {
    //           'filter': [{
    //             'terms': {
    //               'countryId': countries
    //             }
    //           }, {
    //             'terms': {
    //               'year': years
    //             }
    //           }]
    //         }
    //       }
    //     }
    //   }, (err, result) => {
    //     if (err) {
    //       return next(err);
    //     }
    //
    //     for (let element of result.hits.hits) {
    //       let container = elements.get(element._source.countryId)
    //         .get(element._source.year);
    //       if (container) {
    //         container.associations[element._index] = { value: element._source.value };
    //       }
    //     }
    //
    //     res.send(ret);
    //   });
    // } else {
    //   res.send(ret);
    // }

    res.send(ret);
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
