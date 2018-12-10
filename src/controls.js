import $ from 'jquery';
import 'bootstrap-select';
import 'bootstrap-select/dist/css/bootstrap-select.css';

const COUNTRY_SELECT_ID = 'countrySelect';
const MEASURE_SELECT_ID = 'measureSelect';
const FACTOR0_SELECT_ID = 'factor0Select';
const FACTOR1_SELECT_ID = 'factor1Select';
const FACTOR2_SELECT_ID = 'factor2Select';
const FACTOR_CONTROL_IDS = [FACTOR0_SELECT_ID, FACTOR1_SELECT_ID, FACTOR2_SELECT_ID];


const onUpdateHandlers = {
  countrySelect: [],
  measureSelect: [],
  factor0Select: [],
  factor1Select: [],
  factor2Select: [],
};

function sortAlphabetically(data, key) {
  return data.sort((a, b) => {
    const nameA = a[key].toLowerCase();
    const nameB = b[key].toLowerCase();
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0; // default return value (no sorting)
  });
}

function listenForOnUpdateEvents() {
  [COUNTRY_SELECT_ID,
    MEASURE_SELECT_ID,
    FACTOR0_SELECT_ID,
    FACTOR1_SELECT_ID,
    FACTOR2_SELECT_ID].forEach((id) => {
    const select = document.getElementById(id);
    select.onchange = (value) => {
      onUpdateHandlers[id].forEach(handler => handler(value.target.value));
    };
  });
}

function addOptions(elementID, data, htmlKey, valueKey) {
  const select = document.getElementById(elementID);
  sortAlphabetically(data, htmlKey).forEach((d) => {
    const opt = document.createElement('option');
    opt.value = d[valueKey];
    opt.innerHTML = `${d[htmlKey]}`;
    select.appendChild(opt);
  });
}

function selectOption(elementID, value) {
  $(`#${elementID}.selectpicker`).selectpicker('val', value);
}

listenForOnUpdateEvents();

function registerOnUpdateEventHandlers(id, onUpdate) {
  onUpdateHandlers[id].push(onUpdate);
}

function deregisterOnUpdateEventHandlers(id, onUpdate) {
  const index = onUpdateHandlers[id].indexOf(onUpdate);
  if (index > -1) {
    onUpdateHandlers[id].splice(index, 1);
  }
}

export default {
  COUNTRY_SELECT_ID,
  MEASURE_SELECT_ID,
  FACTOR0_SELECT_ID,
  FACTOR1_SELECT_ID,
  FACTOR2_SELECT_ID,
  FACTOR_CONTROL_IDS,
  addOptions,
  deregisterOnUpdateEventHandlers,
  registerOnUpdateEventHandlers,
  selectOption,
};
