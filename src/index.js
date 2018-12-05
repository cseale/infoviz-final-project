// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// styles
import '../styles.css';

// api
import api from './api';

// charts
import map from './map';
import area from './area';
import './scatterplot';
import './stackedbarchart';
import './pie';

import controls from './controls';
import slider from './slider';

let stats = [];
let countryCode = '';
let startYear = 1945;
let endYear = 2008;

function handleCountryUpdate(value) {
  countryCode = value;
  area.updateChart(stats, countryCode);
}

function handleTimeRangeUpdate(values) {
  [startYear, endYear] = values;
}

// listen to controls
slider.registerOnUpdateHandlers(handleTimeRangeUpdate);
controls.registerOnUpdateEventHandlers(controls.COUNTRY_SELECT_ID, handleCountryUpdate);

// listen to map clicks

map.registerOnClickHandler(handleCountryUpdate);
map.registerOnClickHandler(value => controls.selectOption(controls.COUNTRY_SELECT_ID, value));

api.getCountryStats().then(({ data }) => {
  stats = data;
  map.updateMap(stats, startYear, endYear);
  area.updateChart(stats, countryCode, startYear, endYear);
});

api.getCountries().then(({ data }) => {
  controls.addOptions(controls.COUNTRY_SELECT_ID, data, 'countryName', 'countryId');
});
