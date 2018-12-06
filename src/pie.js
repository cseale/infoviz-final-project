import echarts from 'echarts';
import store from './store';

const option = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    data: ['Male', 'Female'],
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
    },
  ],
};

// based on prepared DOM, initialize echarts instance
const myChart = echarts.init(document.getElementById('pie'));
// use configuration item and data specified to show chart
myChart.setOption(option);


function filterData(data, countryId) {
  if (!countryId) {
    return [];
  }

  return data
    .filter(d => d.countryId === countryId
      && d.year <= store.getCurrentEndYear()
      && d.year >= store.getCurrentStartYear());
}

function calculateGenderTotals(data) {
  let maleTotal = 0;
  data.forEach((d) => { maleTotal += d.value; });

  const femaleTotal = 500000;

  return [
    { value: maleTotal, name: 'Male' },
    { value: femaleTotal, name: 'Female' },
  ];
}

function render() {
  const data = filterData(store.getData(), store.getCountryCode());

  myChart.setOption({
    series: [
      {
        data: calculateGenderTotals(data),
      },
    ],
  });
}

function updateChart() {
  render();
}

export default {
  updateChart,
};
