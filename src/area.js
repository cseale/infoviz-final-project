
import echarts from 'echarts';
import _ from 'lodash';

import store from './store';
import { COLORS } from './constants';

const option = {
  grid: {
    left: 60,
    top: 60,
    right: 60,
    bottom: 60,
  },
  color: COLORS.categories,
  legend: {
    data: [],
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

  tooltip: {
    trigger: 'item',
    formatter(params) {
      return `${params.seriesName} - ${params.name}: ${params.data}`;
    },
  },
  dataZoom: [
    {
      id: 'year',
      type: 'slider',
      show: true,
      realtime: false,
      showDataShadow: 'Unknown',
    },
    {
      id: 'range',
      show: true,
      yAxisIndex: 0,
      filterMode: 'empty',
      width: 30,
      height: '80%',
      showDataShadow: false,
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

function onDatazoom(event) {
  if (event.dataZoomId !== 'year') {
    return;
  }

  function convertPercentageToYear(percentage, roundingFn) {
    return roundingFn((percentage / 100)
    * (store.getCurrentMaxYear() - store.getCurrentMinYear()) + store.getCurrentMinYear());
  }

  const startYear = convertPercentageToYear(event.start, Math.ceil);
  const endYear = convertPercentageToYear(event.end, Math.floor);

  onRangeUpdated.forEach(handler => handler({ startYear, endYear }));
}

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

function mapDataToSeries(data) {
  const range = store.getCurrentMaxYear() - store.getCurrentMinYear();
  // eslint-disable-next-line prefer-spread
  const years = Array
    .apply(null, { length: range })
    .map(Number.call, Number)
    .map(v => v + store.getCurrentMinYear());

  let reportingCountryKeys = [];

  data.forEach((d) => {
    const reportingCountry = _.get(d, 'reportingCountry', {});
    reportingCountryKeys = reportingCountryKeys.concat(Object.keys(reportingCountry));
  });

  reportingCountryKeys = _.uniq(reportingCountryKeys);

  const totalsReportedPerYear = {};
  years.forEach((y) => { totalsReportedPerYear[y] = 0; });


  const countrySeries = reportingCountryKeys.map(country => ({
    name: country,
    type: 'line',
    stack: 'Country',
    areaStyle: {},
    data: years.map((y) => {
      let value = data.find(d => Number(d.year) === y);
      value = _.get(value, `reportingCountry.${country}.${store.getFlowType()}.total`, null);
      totalsReportedPerYear[y] += value || 0;
      return value;
    }),
  }));


  const negativeCountrySeries = _.cloneDeep(countrySeries).map((country) => {
    country.data = country.data.map(d => (d < 0 ? d : null));
    country.stack = 'Country';
    return country;
  });

  const positiveCountrySeries = _.cloneDeep(countrySeries).map((country) => {
    country.data = country.data.map(d => (d > 0 ? d : null));
    return country;
  });

  const unknownSeries = [
    {
      name: 'Unknown',
      type: 'line',
      stack: 'Country',
      areaStyle: {},
      data: years.map((y) => {
        let value = data.find(d => Number(d.year) === y);
        value = value ? _.get(value, `${store.getFlowType()}.total`, 0) : 0;
        return value - totalsReportedPerYear[y];
      }),
    },
  ];
  reportingCountryKeys.push('Unknown');

  return [unknownSeries.concat(negativeCountrySeries, positiveCountrySeries), reportingCountryKeys];
}

function extractMinAndMaxYear(data) {
  let min = Infinity;
  let max = -Infinity;
  data.forEach((d) => {
    if (d.year < min) {
      min = Number(d.year);
    }
    if (d.year > max) {
      max = Number(d.year);
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

  const [series, legend] = mapDataToSeries(data);

  myChart.setOption({
    xAxis: {
      data: years,
    },
    legend: {
      data: legend,
    },
    series,
  });

  myChart.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 0,
    start: convertYearToPercentage(store.getCurrentStartYear()),
    end: convertYearToPercentage(store.getCurrentEndYear()),
  });
}

function updateChart() {
  const data = filterMapData(store.getSelectedCountryData(), store.getCountryCode());
  if (data.length > 0) {
    extractMinAndMaxYear(data);
    renderChart(data);
  }
}

function registerOnUpdateHandler(onUpdate) {
  onRangeUpdated.unshift(onUpdate);
  return onUpdate;
}

function deregisterOnUpdateHandler(onUpdate) {
  const index = onUpdate.indexOf(onUpdate);
  if (index > -1) {
    onRangeUpdated.splice(index, 1);
  }
}

// use configuration item and data specified to show chart
myChart.setOption(option);

myChart.on('datazoom', _.debounce(onDatazoom, 150, { maxWait: 1000 }), 150);

export default {
  updateChart,
  registerOnUpdateHandler,
  deregisterOnUpdateHandler,
};
