import echarts from 'echarts';
import _ from 'lodash';
import store from './store';

const option = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    data: ['Male', 'Female', 'Unknown'],
  },
  series: [
    {
      name: 'Gender Breakdown',
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
      && Number(d.year) <= store.getCurrentEndYear()
      && Number(d.year) >= store.getCurrentStartYear());
}

function calculateGenderTotals(data) {
  let maleTotal = 0;
  let femaleTotal = 0;
  let totalTotal = 0;
  console.log(data);
  data.forEach((d) => {
    maleTotal += _.get(d, `${store.getFlowType()}.male`, 0);
    femaleTotal += _.get(d, `${store.getFlowType()}.female`, 0);
    totalTotal += _.get(d, `${store.getFlowType()}.total`, 0);
  });

  return [
    { value: maleTotal, name: 'Male' },
    { value: femaleTotal, name: 'Female' },
    { value: totalTotal - maleTotal - femaleTotal, name: 'Unknown' },
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
