'use strict';

const express = require('express');
const app = express();
const port = 3000;

const elasticsearch = require('elasticsearch');
const compression = require('compression');


/**
 *
 * @type {Client}
 */
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});


// use json middleware
app.use(express.json());
// request is huge, use compression
app.use(compression());


/**
 * Used for genting a complete list of countries with their id
 */
app.get('/countries', (req, res, next) => {
  // tell the browser to cache the request
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
                // only return the interesting field
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

/**
 * Main endpoint. Used to return relevant associations and inflow/outflow/netflow data
 *  startYear = Return only years > than this
 *  endYear = Return only years < than this
 *  isoCode = Return only countries with this countryId. Supports multiple values
 *  associations = Return only associations with this name. Supports multiple values
 *  reportingCountry = Whether to return the reporting country information. Defaults to false
 */
app.get('/countryStats', (req, res, next) => {
  // tell the browser to cache the request
  res.set('Cache-Control', 'public, max-age=31557600'); // one year

  // extract the query arguments
  let { startYear, endYear, isoCode, associations, reportingCountry } = req.query;

  let should;
  if (associations) {
    // if association filters are present
    if (!Array.isArray(associations)) {
      // unify flows
      associations = [associations];
    }

    should = {
      // use nested query to filter the return associations result
      'nested': {
        'path': 'associations',
        'query': {
          'terms': {
            'associations.name': associations
          }
        },
        'inner_hits': {
          'size': associations.length
        }
      }
    };
  }

  let filter = [];
  if (startYear || endYear) {
    // filter the years
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
    // filter the countryCode, split the flows for performance consideration
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
  let _sourceExclude = [];

  if (!filter.length)
  // if no actuall filters were used set it to undefined because undefined fields do not get serialized
  {
    filter = undefined;
  }

  if (filter || should) {
    // compose the query if needed
    query = {
      'bool': {
        filter,
        should
      }
    };
  }
  let ret = [];
  if (!reportingCountry) {
    // exclude the reporting country field if needed
    _sourceExclude.push('reportingCountry');
  }
  if (should) {
    // if we did filtering exclude the associations data from the _source because we will get them
    // in the inner_hits result
    _sourceExclude.push('associations');
  }

  client.search({
    index: 'migration_total',
    type: '_doc',
    // use scrolling to get all the results because we have too much data :)
    scroll: '1m',
    _sourceExclude,
    body: {
      // maximum possible search
      'size': 10000,
      query
    }
  }, processResults);

  /**
   * Callback for processing the results from ES. Gets called multiple times till it scrolls over
   * the whole results
   */
  function processResults(err, result) {
    if (err) {
      // return an error, Express way
      return next(err);
    }

    // extract the scroll_id
    let { _scroll_id } = result;
    if (result.hits.total) {
      result.hits.hits.forEach(e => {
        let s = e._source;

        // pack them as a POJO so it's easier for the frontend
        let res = {};
        if (associations) {
          // if we have associations filters, that means our results are in the inner_hits field
          if (e.inner_hits.associations.hits.total) {
            e.inner_hits.associations.hits.hits.forEach(e => {
                res[e._source.name] = e._source.value;
              }
            );
          }
        } else {
          // no filters, just scroll and pack
          if (s.associations.length) {
            s.associations.forEach(e => {
                res[e.name] = e.value;
              }
            );
          }
        }

        // add the result
        s.associations = res;

        // push the result
        ret.push(s);
      });
    }

    if (ret.length < result.hits.total) {
      // if we didn't finish all the results, use the scroll to complete the processing
      client.scroll({
        scroll: '1m',
        scrollId: _scroll_id
      }, processResults);
    } else {
      // we are finished, send the results
      res.send(ret);
    }
  }
});

// start the server
app.listen(port, () => console.log(`App listening on port ${port}!`));
