/**
 * File for generating the scatterplots for the vis
 * author: Colm Seale
 */

import echarts from 'echarts';
import _ from 'lodash';

import store from './store';

// based on prepared DOM, initialize echarts instance
const myChart = [
  echarts.init(document.getElementById('scatterplot')),
  echarts.init(document.getElementById('scatterplot2')),
  echarts.init(document.getElementById('scatterplot3')),
];

const option = {
  grid: {
    right: 40,
  },
  xAxis: {
    name: 'Flow',
  },
  yAxis: {},
  tooltip: {
    trigger: 'item',
    formatter(params) {
      return `${store.getCountryCode()} - ${params.data.value[2]}<br/>${store.getFlowType()}: ${params.data.value[0]}<br/>${params.data.value[3]}: ${params.data.value[1]}`;
    },
  },
  series: [{
    symbolSize: 20,
    type: 'scatter',
    emphasis: {
      itemStyle: {
        borderColor: '#333',
        borderWidth: 3,
      },
    },
  }],
};


// use configuration item and data specified to show chart
myChart.forEach((chart) => {
  chart.setOption(option);
  chart.on('click', (d) => { console.log(d); });
});

function filterData(data, countryId) {
  if (!countryId) {
    return [];
  }

  return data
    .filter(d => d.countryId === countryId)
    .sort((a, b) => a.year - b.year);
}

function render(index) {
  const key = store[`getFactor${index}`]();
  const data = filterData(store.getData(),
    store.getCountryCode());


  // It shapes the data for the scatterplot.
  // You're on your own trying to understand it though.
  const mappedData = data
    .filter(d => _.isNumber(d.associations[key]) && d.associations[key] > 0)
    .map(d => ({
      value: [_.get(d, `${store.getFlowType()}.total`, 0), _.get(d, `associations[${key}]`, 0), d.year, key],
      itemStyle: Number(d.year) >= store.getCurrentStartYear()
    && Number(d.year) <= store.getCurrentEndYear()
        ? {} : { color: 'grey', opacity: 0.3 },
    }));

  myChart[index].setOption({
    title: {
      show: true,
      text: `${store.getFlowType()} vs ${key}`,
      textStyle: {
        fontSize: 14,
      },
    },
    yAxis: {
      name: key,
    },
    series: [
      {
        data: mappedData,
      },
    ],
  });
}

function updateChart(index) {
  render(index);
}

export default {
  updateChart,
};
