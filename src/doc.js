const startYear = document.getElementById('startYear');
const endYear = document.getElementById('endYear');

function setStartYear(value) {
  startYear.innerHTML = value;
}

function setEndYear(value) {
  endYear.innerHTML = value;
}

export default {
  setStartYear,
  setEndYear,
};
