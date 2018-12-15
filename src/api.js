/**
 * REST API interface
 * author: Colm Seale
 */

import axios from 'axios';

function getCountries() {
  return axios.get('/countries');
}

function getAllCountryStats() {
  return axios.get('/countryStats');
}

function getCountryStats(reportingCountry) {
  return axios.get(`/countryStats?isoCode=${reportingCountry}&reportingCountry=true`);
}

export default {
  getCountries,
  getCountryStats,
  getAllCountryStats,
};
