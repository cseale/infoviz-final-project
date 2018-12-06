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
  series: [{
    symbolSize: 20,
    type: 'scatter',
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

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function render(index) {
  const data = filterData(store.getData(),
    store.getCountryCode());


  const mappedData = data.map(d => ({
    value: [_.get(d, `${store.getFlowType()}.total`, 0), random(_.get(d, `${store.getFlowType()}.total`, 0))],
    itemStyle: Number(d.year) >= store.getCurrentStartYear()
    && Number(d.year) <= store.getCurrentEndYear()
      ? {} : { color: 'grey', opacity: 0.3 },
  }));

  console.log(mappedData);

  myChart[index].setOption({
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
