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

import controls from './controls';
import './slider';

let stats = [];
let countryCode = '';

function handleCountryUpdate(value) {
  countryCode = value;
  area.updateChart(stats, countryCode);
  console.log('carted upated');
}

// listen to controls

controls.registerOnUpdateEventHandlers(controls.COUNTRY_SELECT_ID, handleCountryUpdate);

// listen to map clicks

map.registerOnClickHandler(handleCountryUpdate);
map.registerOnClickHandler(value => controls.selectOption(controls.COUNTRY_SELECT_ID, value));

api.getCountryStats().then(({ data }) => {
  stats = data;
  map.updateMap(stats);
  area.updateChart(stats, countryCode);
});

api.getCountries().then(({ data }) => {
  controls.addOptions(controls.COUNTRY_SELECT_ID, data, 'countryName', 'countryId');
});
