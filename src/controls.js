import { updateMap } from './map';

const select = document.getElementById('countrySelect');

const max = 100;

for (let i = 1; i <= max; i += 1) {
  const opt = document.createElement('option');
  opt.value = i;
  opt.innerHTML = `Country, ${i}!`;
  select.appendChild(opt);
}

select.onchange = (value) => {
  updateMap(value);
};
