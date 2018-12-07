// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as splashScreen from 'splash-screen';

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

function handleCountryUpdate(value) {
  store.setCountryCode(value);
  area.updateChart();
  pie.updateChart();
  scatterplot.updateChart(0);
  scatterplot.updateChart(1);
  scatterplot.updateChart(2);
}

function handleMeasureUpdate(value) {
  doc.setFlowType(value);
  store.setFlowType(value);
  map.updateMap();
  area.updateChart();
  pie.updateChart();
  scatterplot.updateChart(0);
  scatterplot.updateChart(1);
  scatterplot.updateChart(2);
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
  scatterplot.updateChart(0);
  scatterplot.updateChart(1);
  scatterplot.updateChart(2);
}

// listen to controls
controls.registerOnUpdateEventHandlers(controls.COUNTRY_SELECT_ID, handleCountryUpdate);
controls.registerOnUpdateEventHandlers(controls.MEASURE_SELECT_ID, handleMeasureUpdate);

// listen to map clicks
map.registerOnClickHandler(handleCountryUpdate);
map.registerOnClickHandler(value => controls.selectOption(controls.COUNTRY_SELECT_ID, value));

// listen to area chart
area.registerOnUpdateHandler(handleAreaChartUpdates);

api.getCountryStats().then(({ data }) => {
  splashScreen.destroy();
  store.setData(data);
  map.updateMap();
});

api.getCountries().then(({ data }) => {
  store.setCountries(data);
  controls.addOptions(controls.COUNTRY_SELECT_ID, data, 'countryName', 'countryId');
});

splashScreen.enable('audio-wave');
