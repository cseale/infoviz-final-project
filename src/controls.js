const COUNTRY_SELECT_ID = 'countrySelect';
const MEASURE_SELECT_ID = 'measureSelect';
const FACTOR_SELECT_ID = 'factorSelect';


const onUpdateHandlers = [];

function listenForOnUpdateEvents() {
  [COUNTRY_SELECT_ID, MEASURE_SELECT_ID].forEach((id) => {
    const select = document.getElementById(id);
    select.onchange = (value) => {
      console.log(`value updated ${value.target.value}`);
      onUpdateHandlers.forEach(handler => handler());
    };
  });
}

function addOptions(elementID, data, htmlKey, valueKey) {
  const select = document.getElementById(elementID);
  data.forEach((d) => {
    const opt = document.createElement('option');
    opt.value = d[valueKey];
    opt.innerHTML = `Country, ${d[htmlKey]}!`;
    select.appendChild(opt);
  });
}

listenForOnUpdateEvents();

function registerOnUpdateEventHandlers(onUpdate) {
  onUpdateHandlers.push(onUpdate);
}

function deregisterOnUpdateEventHandlers(onUpdate) {
  const index = onUpdateHandlers.indexOf(onUpdate);
  if (index > -1) {
    onUpdateHandlers.splice(index, 1);
  }
}

export {
  COUNTRY_SELECT_ID,
  MEASURE_SELECT_ID,
  FACTOR_SELECT_ID,
  addOptions,
  deregisterOnUpdateEventHandlers,
  registerOnUpdateEventHandlers,
};
