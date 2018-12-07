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

    associations = new Set(associations);
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
  let ret = [];

  get(0);

  function get(index) {
    client.search({
      index: 'migration_total',
      type: '_doc',
      body: {
        // 'sort': {
        //   'year': {
        //     'contryId': 'asc',
        //     'order': 'desc'
        //   }
        // },
        from: index,
        'size': 10000,
        query
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }

      if (result.hits.total) {
        ret = result.hits.hits.map(e => {
          let s = e._source;

          if (associations && s.associations.length) {
            s.associations = s.associations.filter(e => associations.has(e.name));
          }

          return s;
        });
      }

      if (result.hits.total < ret.length) {
        get(ret.length);
      } else {
        res.send(ret);
      }
    });
  }

});

app.listen(port, () => console.log(`App listening on port ${port}!`));
