import echarts from 'echarts';
import _ from 'lodash';
import store from './store';
import { COLORS } from './constants';

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
      color: COLORS.pieInner,
      name: 'Gender Breakdown',
      type: 'pie',
      radius: ['0%', '30%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
        },
        fontSize: 13,
        emphasis: {
          show: false,
          textStyle: {
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
    {
      color: COLORS.pieOuter,
      name: 'Citizenship',
      type: 'pie',
      radius: ['40%', '55%'],
      label: {
        fontSize: 14,
        normal: {
          fontSize: 15,
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

function calculateTotals(data) {
  function fixshittynumbers(d, type) {
    return Math.abs(_.get(d, type, 0));
  }

  let maleTotal = 0;
  let femaleTotal = 0;
  let totalTotal = 0;
  let citizenFemale = 0;
  let foreignerFemale = 0;
  let citizenMale = 0;
  let foreignerMale = 0;

  data.forEach((d) => {
    maleTotal += fixshittynumbers(d, `${store.getFlowType()}.male`, 0);
    femaleTotal += fixshittynumbers(d, `${store.getFlowType()}.female`, 0);
    totalTotal += fixshittynumbers(d, `${store.getFlowType()}.total`, 0);

    citizenFemale += fixshittynumbers(d, `${store.getFlowType()}.citizens.male`, 0);
    foreignerFemale += fixshittynumbers(d, `${store.getFlowType()}.citizens.female`, 0);
    citizenMale += fixshittynumbers(d, `${store.getFlowType()}.foreigners.male`, 0);
    foreignerMale += fixshittynumbers(d, `${store.getFlowType()}.foreigners.female`, 0);
  });
  const unknownTotal = totalTotal - maleTotal - femaleTotal;
  const unknownFemale = femaleTotal - citizenFemale - foreignerFemale;
  const unknownMale = maleTotal - citizenMale - foreignerMale;
  const citizens = [
    { value: citizenMale, name: 'Male Citizen' },
    { value: foreignerMale, name: 'Male Foreigner' },
    { value: unknownMale > 0 ? unknownMale : 0, name: 'Male Unknown' },
    { value: citizenFemale, name: 'Female Citizen' },
    { value: foreignerFemale, name: 'Female Foreigner' },
    { value: unknownFemale > 0 ? unknownFemale : 0, name: 'Female Unknown' },
    { value: unknownTotal, name: 'Unknown' },
  ];

  const totals = [
    { value: maleTotal, name: 'Male' },
    { value: femaleTotal, name: 'Female' },
    { value: totalTotal - maleTotal - femaleTotal, name: 'Unknown' },
  ];

  return [totals, citizens];
}

function render() {
  const data = filterData(store.getData(), store.getCountryCode());
  const [totals, citizens] = calculateTotals(data);
  myChart.setOption({
    series: [
      {
        data: totals,
      },
      {
        data: citizens,
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
