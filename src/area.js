import echarts from 'echarts';

const option = {
  grid: {
    left: 20,
    top: 8,
    right: 8,
    bottom: 40,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false,
    },
  },
  series: [{
    type: 'line',
    areaStyle: {},
  }],
};

// based on prepared DOM, initialize echarts instance
const myChart = echarts.init(document.getElementById('area'));

function filterMapData(data, countryId) {
  return data.filter(d => d.countryId === countryId).sort((a, b) => a.year - b.year);
}

function renderChart(data) {
  myChart.setOption({
    xAxis: {
      data: data.map(d => d.year),
    },
    series: [
      {
        data: data.map(d => d.value),
      },
    ],
  });
}

// use configuration item and data specified to show chart
myChart.setOption(option);

function updateChart(data, code) {
  if (!code) {
    console.log('no country code, not rendering area chart');
    return;
  }

  data = filterMapData(data, code);
  renderChart(data);
}

export default {
  updateChart,
};
