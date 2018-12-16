/**
 * File for storing vis state and app data
 * author: Colm Seale
 */

import { GDP_GROWTH, EXPORTS, HOMICIDES } from './constants';

const MAX_YEAR = 2011;
const MIN_YEAR = 1930;

let data = [];
let selectedCountryData = [];
let countries = [];
let countryCode = '';
let flowType = 'inflow';
let currentStartYear = MIN_YEAR;
let currentEndYear = MAX_YEAR;
let currentMinYear = MIN_YEAR;
let currentMaxYear = MAX_YEAR;
let factor0 = GDP_GROWTH;
let factor1 = EXPORTS;
let factor2 = HOMICIDES;

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

function getSelectedCountryData() {
  return selectedCountryData;
}

function setSelectedCountryData(d) {
  selectedCountryData = d;
}

function getCountries() {
  return countries;
}

function setCountries(c) {
  countries = c;
}

function setFlowType(ft) {
  flowType = ft;
}

function getFlowType() {
  return flowType;
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

function setCurrentMinYear(year) {
  currentMinYear = year;
}

function setCurrentMaxYear(year) {
  currentMaxYear = year;
}

function getFactor1() {
  return factor1;
}

function setFactor1(factor) {
  factor1 = factor;
}

function getFactor2() {
  return factor2;
}

function setFactor2(factor) {
  factor2 = factor;
}

function getFactor0() {
  return factor0;
}

function setFactor0(factor) {
  factor0 = factor;
}

export default {
  getCountryCode,
  setCountryCode,
  getCountries,
  setCountries,
  getData,
  setData,
  getFactor1,
  setFactor1,
  getFactor2,
  setFactor2,
  getFactor0,
  setFactor0,
  getFlowType,
  setFlowType,
  getCurrentEndYear,
  setCurrentEndYear,
  getCurrentMaxYear,
  setCurrentMaxYear,
  getCurrentMinYear,
  setCurrentMinYear,
  getCurrentStartYear,
  setCurrentStartYear,
  getSelectedCountryData,
  setSelectedCountryData,
};
