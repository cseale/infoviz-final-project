import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import wNumb from 'wnumb';

const dateSlider = document.getElementById('slider-date');

const onUpdateHandlers = [];

function timestamp(str) {
  return new Date(str).getTime();
}

noUiSlider.create(dateSlider, {
// Create two timestamps to define a range.
  range: {
    min: timestamp('1945'),
    max: timestamp('2008'),
  },

  // Steps of one week
  step: 365 * 24 * 60 * 60 * 1000,

  // Two more timestamps indicate the handle starting positions.
  start: [timestamp('1945'), timestamp('2008')],

  // No decimals
  format: wNumb({
    decimals: 0,
  }),
});

const dateValues = [
  document.getElementById('event-start'),
  document.getElementById('event-end'),
];

const titleDateValues = [
  document.getElementById('startYear'),
  document.getElementById('endYear'),
];

// Create a string representation of the date.
function formatDate(date) {
  return date.getFullYear();
}

function registerOnUpdateHandlers(onUpdate) {
  onUpdateHandlers.push(onUpdate);
  return onUpdate;
}

function deregisterOnUpdateHandler(onClick) {
  const index = onUpdateHandlers.indexOf(onClick);
  if (index > -1) {
    onUpdateHandlers.splice(index, 1);
  }
}


dateSlider.noUiSlider.on('update', (values, handle) => {
  dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
  titleDateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
  onUpdateHandlers.forEach(handler => handler(values.map(v => formatDate(new Date(+v)))));
});


export default {
  registerOnUpdateHandlers,
  deregisterOnUpdateHandler,
};
