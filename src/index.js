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
import scatterplot from './scatterplot';
import './stackedbarchart';
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

function handleAreaChartUpdates(event) {
  const { startYear, endYear } = event;
  doc.setStartYear(startYear);
  doc.setEndYear(endYear);
  store.setCurrentStartYear(startYear);
  store.setCurrentEndYear(endYear);

  // update all charts dependant on time
  pie.updateChart();
  scatterplot.updateChart(0);
  scatterplot.updateChart(1);
  scatterplot.updateChart(2);
}

// listen to controls
controls.registerOnUpdateEventHandlers(controls.COUNTRY_SELECT_ID, handleCountryUpdate);

// listen to map clicks

map.registerOnClickHandler(handleCountryUpdate);
map.registerOnClickHandler(value => controls.selectOption(controls.COUNTRY_SELECT_ID, value));

// listen to area chart
area.registerOnUpdateHandler(handleAreaChartUpdates);

api.getCountryStats().then(({ data }) => {
  store.setData(data);
  map.updateMap();
});

api.getCountries().then(({ data }) => {
  controls.addOptions(controls.COUNTRY_SELECT_ID, data, 'countryName', 'countryId');
});
