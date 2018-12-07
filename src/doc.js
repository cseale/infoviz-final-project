const startYear = document.getElementById('startYear');
const endYear = document.getElementById('endYear');
const loading = document.getElementById('loading');
const flowTypeMapTitle = document.getElementById('flowTypeTitle');

function setFlowType(value) {
  flowTypeMapTitle.innerHTML = value.charAt(0).toUpperCase() + value.substr(1);
}

function setStartYear(value) {
  startYear.innerHTML = value;
}

function setEndYear(value) {
  endYear.innerHTML = value;
}

function setLoading(value) {
  loading.innerHTML = value;
}

export default {
  setFlowType,
  setStartYear,
  setEndYear,
  setLoading,
};
