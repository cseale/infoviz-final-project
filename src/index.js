// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

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

let scrollOnMapClickHandler;

function scrollToElement(elementId) {
  $('html, body').animate({
    scrollTop: $(`#${elementId}`).offset().top - 200,
  }, 1000, () => {
    window.location.hash = elementId;
    map.deregisterOnClickHandler(scrollOnMapClickHandler);
  });
}

function handleCountryUpdate(value) {
  countryCode = value;
  area.updateChart(stats, countryCode);
}

// listen to controls

controls.registerOnUpdateEventHandlers(controls.COUNTRY_SELECT_ID, handleCountryUpdate);

// listen to map clicks

map.registerOnClickHandler(handleCountryUpdate);
scrollOnMapClickHandler = map.registerOnClickHandler(() => scrollToElement('trend'));
map.registerOnClickHandler(value => controls.selectOption(controls.COUNTRY_SELECT_ID, value));

api.getCountryStats().then(({ data }) => {
  stats = data;
  map.updateMap(stats);
  area.updateChart(stats, countryCode);
});

api.getCountries().then(({ data }) => {
  controls.addOptions(controls.COUNTRY_SELECT_ID, data, 'countryName', 'countryId');
});
