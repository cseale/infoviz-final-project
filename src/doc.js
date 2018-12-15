/**
 * File for updating certain text elements on screen
 * author: Colm Seale
 */

const startYear = document.getElementById('startYear');
const endYear = document.getElementById('endYear');
const countryTrend = document.getElementById('countryTrend');
const flowTypeMapTitle = document.getElementById('flowTypeTitle');
const corrFlowName = document.getElementById('corrFlowName');

function setFlowType(value) {
  flowTypeMapTitle.innerHTML = value.charAt(0).toUpperCase() + value.substr(1);
  corrFlowName.innerHTML = value.charAt(0).toUpperCase() + value.substr(1);
}

function setStartYear(value) {
  startYear.innerHTML = value;
}

function setEndYear(value) {
  endYear.innerHTML = value;
}

function setCountryTrend(value) {
  countryTrend.innerHTML = value;
}

export default {
  setFlowType,
  setStartYear,
  setEndYear,
  setCountryTrend,
};
