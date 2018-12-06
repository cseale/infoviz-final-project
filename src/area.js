
import echarts from 'echarts';

import store from './store';

const option = {
  grid: {
    left: 60,
    top: 8,
    right: 40,
    bottom: 60,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: true,
    },
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      realtime: true,
    },
  ],
  series: [{
    type: 'line',
    areaStyle: {},
  }],
};
// based on prepared DOM, initialize echarts instance
const myChart = echarts.init(document.getElementById('area'));
const onRangeUpdated = [];

// use configuration item and data specified to show chart
myChart.setOption(option);

myChart.on('datazoom', (event) => {
  function convertPercentageToYear(percentage, roundingFn) {
    return roundingFn((percentage / 100)
    * (store.getCurrentMaxYear() - store.getCurrentMinYear()) + store.getCurrentMinYear());
  }

  const startYear = convertPercentageToYear(event.start, Math.ceil);
  const endYear = convertPercentageToYear(event.end, Math.floor);
  onRangeUpdated.forEach(handler => handler({ startYear, endYear }));
});


function convertYearToPercentage(year) {
  const value = (year - store.getCurrentMinYear()) / (store.getCurrentMaxYear()
  - store.getCurrentMinYear()) * 100;
  if (value > 100) {
    return 100;
  }
  if (value < 0) {
    return 0;
  }
  return value;
}

function extractMinAndMaxYear(data) {
  let min = Infinity;
  let max = -Infinity;
  data.forEach((d) => {
    if (d.year < min) {
      min = d.year;
    }
    if (d.year > max) {
      max = d.year;
    }
  });
  store.setCurrentMaxYear(max);
  store.setCurrentMinYear(min);
  return [min, max];
}

function filterMapData(data, countryId) {
  if (!countryId) {
    return [];
  }

  return data
    .filter(d => d.countryId === countryId)
    .sort((a, b) => a.year - b.year);
}

function renderChart(data) {
  const range = store.getCurrentMaxYear() - store.getCurrentMinYear();
  // eslint-disable-next-line prefer-spread
  const years = Array
    .apply(null, { length: range })
    .map(Number.call, Number)
    .map(v => v + store.getCurrentMinYear());

  myChart.setOption({
    xAxis: {
      data: years,
    },
    series: [
      {
        data: years.map((y) => {
          const values = data.filter(d => d.year === y);
          return values ? values[0] : 0;
        }),
      },
    ],
  });

  myChart.dispatchAction({
    type: 'dataZoom',
    start: convertYearToPercentage(store.getCurrentMinYear()),
    // data value at ending location
    end: convertYearToPercentage(store.getCurrentMaxYear()),
  });
}

function updateChart() {
  const data = filterMapData(store.getData(), store.getCountryCode());
  if (data.length > 0) {
    extractMinAndMaxYear(data);
    renderChart(data);
  }
}

function registerOnUpdateHandler(onUpdate) {
  onRangeUpdated.push(onUpdate);
  return onUpdate;
}

function deregisterOnUpdateHandler(onUpdate) {
  const index = onUpdate.indexOf(onUpdate);
  if (index > -1) {
    onRangeUpdated.splice(index, 1);
  }
}

export default {
  updateChart,
  registerOnUpdateHandler,
  deregisterOnUpdateHandler,
};
