import axios from 'axios';

function getCountryStats() {
  return axios.get('/countries');
}

export default {
  getCountryStats,
};
