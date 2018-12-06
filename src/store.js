const MAX_YEAR = 2015;
const MIN_YEAR = 1930;

let data = [];
let countryCode = '';
let currentStartYear = MIN_YEAR;
let currentEndYear = MAX_YEAR;
const currentMinYear = MIN_YEAR;
const currentMaxYear = MAX_YEAR;

function getCountryCode() {
  return countryCode;
}

function setCountryCode(code) {
  countryCode = code;
}

function setData(d) {
  data = d;
}

function getData() {
  return data;
}

function getCurrentStartYear() {
  return currentStartYear;
}

function getCurrentEndYear() {
  return currentEndYear;
}


function getCurrentMinYear() {
  return currentMinYear;
}

function getCurrentMaxYear() {
  return currentMaxYear;
}

function setCurrentStartYear(year) {
  currentStartYear = year;
}

function setCurrentEndYear(year) {
  currentEndYear = year;
}

function setCurrentMinYear() {
  return currentMinYear;
}

function setCurrentMaxYear() {
  return currentEndYear;
}

export default {
  getCountryCode,
  setCountryCode,
  getData,
  setData,
  getCurrentEndYear,
  setCurrentEndYear,
  getCurrentMaxYear,
  setCurrentMaxYear,
  getCurrentMinYear,
  setCurrentMinYear,
  getCurrentStartYear,
  setCurrentStartYear,
};
