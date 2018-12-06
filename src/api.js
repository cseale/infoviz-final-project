import axios from 'axios';

function getCountries() {
  return axios.get('/countries');
}

function getCountryStats() {
  return axios.get('/countryStats');
}

export default {
  getCountries,
  getCountryStats,
};
