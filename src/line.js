/**
 * File that does sweet bugger all. Ignore him.
 * author: Colm Seale
 */

import echarts from 'echarts';

// based on prepared DOM, initialize echarts instance
const myChart = echarts.init(document.getElementById('line'));


const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line',
  }],
};

// use configuration item and data specified to show chart
myChart.setOption(option);
