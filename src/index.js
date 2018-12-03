// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'bootstrap-select';

// styles
import '../styles.css';

// api
import api from './api';

// charts
import './line';
import './scatterplot';
import './stackedbarchart';
import map from './map';

import { addOptions, COUNTRY_SELECT_ID } from './controls';

api.getCountryStats().then((data) => {
  map.updateMap(data.data);
});


// addOptions(COUNTRY_SELECT_ID, dummyCountries, 'name', 'id');
