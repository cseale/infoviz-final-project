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
  res.set('Cache-Control', 'public, max-age=31557600'); // one year
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
  res.set('Cache-Control', 'public, max-age=31557600'); // one year
  let { startYear, endYear, isoCode, associations, reportingCountry } = req.query;

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
  let _sourceExclude;
  if (!reportingCountry) {
    _sourceExclude = "reportingCountry";
  }


  client.search({
    index: 'migration_total',
    type: '_doc',
    scroll: '1m',
    _sourceExclude,
    body: {
      // 'sort': {
      //   'year': {
      //     'contryId': 'asc',
      //     'order': 'desc'
      //   }
      // },
      'size': 10000,
      query
    }
  }, processResults);

  function processResults(err, result) {
    if (err) {
      return next(err);
    }

    let { _scroll_id } = result;
    if (result.hits.total) {
      result.hits.hits.forEach(e => {
        let s = e._source;

        let res = {};
        if (s.associations.length) {
          s.associations.forEach(e => {
              if (!associations || associations.has(e.name)) {
                res[e.name] = e.value;
              }
            }
          );
        }

        s.associations = res;

        ret.push(s);
      });
    }

    if (ret.length < result.hits.total) {
      client.scroll({
        scroll: '1m',
        scrollId: _scroll_id
      }, processResults);
    } else {
      res.send(ret);
    }
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
