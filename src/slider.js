/**
 * File for generating the slider for the vis
 * author: Colm Seale
 */


import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import wNumb from 'wnumb';
import store from './store';

const dateSlider = document.getElementById('slider-date');

const onUpdateHandlers = [];

function timestamp(str) {
  return new Date(str).getTime();
}

noUiSlider.create(dateSlider, {
// Create two timestamps to define a range.
  range: {
    min: timestamp(`${store.getCurrentMinYear()}`),
    max: timestamp(`${store.getCurrentMaxYear()}`),
  },

  // Steps of one week
  step: 365 * 24 * 60 * 60 * 1000,

  // Two more timestamps indicate the handle starting positions.
  start: [timestamp(`${store.getCurrentMinYear()}`), timestamp(`${store.getCurrentMaxYear()}`)],

  // No decimals
  format: wNumb({
    decimals: 0,
  }),
});

const dateValues = [
  document.getElementById('event-start'),
  document.getElementById('event-end'),
];

// Create a string representation of the date.
function formatDate(date) {
  return date.getFullYear();
}

function updateLabelsWithTimestamps(values, handle) {
  dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
}

function updateLabel(value, handle) {
  dateValues[handle].innerHTML = value;
}

function registerOnUpdateHandlers(handler) {
  onUpdateHandlers.push(handler);
  return handler;
}

function deregisterOnUpdateHandler(onClick) {
  const index = onUpdateHandlers.indexOf(onClick);
  if (index > -1) {
    onUpdateHandlers.splice(index, 1);
  }
}

function onUpdate(values, handle) {
  updateLabelsWithTimestamps(values, handle);
  onUpdateHandlers.forEach(handler => handler(values.map(v => formatDate(new Date(+v)))));
}

function setupUpdateListeners() {
  dateSlider.noUiSlider.on('set', onUpdate);
  dateSlider.noUiSlider.on('update', updateLabelsWithTimestamps);
}

function update(start, end) {
  dateSlider.noUiSlider.set([timestamp(`${start}`), timestamp(`${end}`)]);
}

setupUpdateListeners();
updateLabel(store.getCurrentMinYear(), 0);
updateLabel(store.getCurrentMaxYear(), 1);

export default {
  update,
  registerOnUpdateHandlers,
  deregisterOnUpdateHandler,
};
