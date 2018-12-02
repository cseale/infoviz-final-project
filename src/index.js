// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'bootstrap-select';

// styles
import '../styles.css';

// maps
import './scatterplot';
import './stackedbarchart';
import './map';

import { addOptions, COUNTRY_SELECT_ID } from './controls';

const dummyCountries = [
  { id: 'A', name: 'Country A' },
  { id: 'B', name: 'Country B' },
];

addOptions(COUNTRY_SELECT_ID, dummyCountries, 'name', 'id');
