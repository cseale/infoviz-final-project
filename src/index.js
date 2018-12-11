// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// splash screen
import * as splashScreen from 'splash-screen';
import 'splash-screen/dist/splash-screen.min.css';

// styles
import '../styles.css';

// api
import api from './api';

// charts
import map from './map';
import area from './area';
import scatterplot from './scatterplot';
// import './stackedbarchart';
import pie from './pie';

// controls
import controls from './controls';
import doc from './doc';


// data management
import store from './store';
import {
  HOMICIDES, EXPORTS, FACTORS, GDP_PER_CAPITA,
} from './constants';

/**
 * Callback functions
 */

function handleFactorUpdate(index) {
  return (key) => {
    store[`setFactor${index}`](key);
    scatterplot.updateChart(index);
  };
}

function handleCountryUpdate(value) {
  splashScreen.enable('audio-wave');
  doc.setCountryTrend(value);
  store.setCountryCode(value);
  map.updateMap();

  [0, 1, 2].forEach(i => scatterplot.updateChart(i));
  api.getCountryStats(value).then((countryData) => {
    store.setSelectedCountryData(countryData.data);
    area.updateChart();
    pie.updateChart();
    splashScreen.destroy();
  });
}

function handleMeasureUpdate(value) {
  doc.setFlowType(value);
  store.setFlowType(value);
  map.updateMap();
  area.updateChart();
  pie.updateChart();
  [0, 1, 2].forEach(i => scatterplot.updateChart(i));
}

function handleAreaChartUpdates(event) {
  const { startYear, endYear } = event;
  doc.setStartYear(startYear);
  doc.setEndYear(endYear);
  store.setCurrentStartYear(startYear);
  store.setCurrentEndYear(endYear);

  // update all charts dependant on time
  map.updateMap();
  pie.updateChart();
  [0, 1, 2].forEach(i => scatterplot.updateChart(i));
}

/**
 * Asnyc Calls
 */

api.getAllCountryStats().then(({ data }) => {
  store.setData(data);
  map.updateMap();
  splashScreen.destroy();
});

api.getCountries().then(({ data }) => {
  store.setCountries(data);
  controls.addOptions(controls.COUNTRY_SELECT_ID, data, 'countryName', 'countryId');
});

/**
 * Control Setup
 */
controls.addOptions(controls.FACTOR0_SELECT_ID, FACTORS, 'name', 'name');
controls.selectOption(controls.FACTOR0_SELECT_ID, store.getFactor0());

controls.addOptions(controls.FACTOR1_SELECT_ID, FACTORS, 'name', 'name');
controls.selectOption(controls.FACTOR1_SELECT_ID, store.getFactor1());

controls.addOptions(controls.FACTOR2_SELECT_ID, FACTORS, 'name', 'name');
controls.selectOption(controls.FACTOR2_SELECT_ID, store.getFactor2());

/**
 * Register Listeners
 */

// listen to controls
controls.FACTOR_CONTROL_IDS.forEach((id, index) => {
  controls.registerOnUpdateEventHandlers(id, handleFactorUpdate(index));
});

controls.registerOnUpdateEventHandlers(controls.COUNTRY_SELECT_ID, handleCountryUpdate);
controls.registerOnUpdateEventHandlers(controls.MEASURE_SELECT_ID, handleMeasureUpdate);

// listen to map clicks
map.registerOnClickHandler(handleCountryUpdate);
map.registerOnClickHandler(value => controls.selectOption(controls.COUNTRY_SELECT_ID, value));

// listen to area chart
area.registerOnUpdateHandler(handleAreaChartUpdates);

/**
 * Start App
 */
splashScreen.enable('audio-wave');
