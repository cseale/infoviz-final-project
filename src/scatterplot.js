import echarts from 'echarts';

// based on prepared DOM, initialize echarts instance
const myChart = echarts.init(document.getElementById('scatterplot'));

const option = {
  xAxis: {},
  yAxis: {},
  series: [{
    symbolSize: 20,
    data: [
      [10.0, 8.04],
      [8.0, 6.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84],
      [7.0, 4.82],
      [5.0, 5.68],
    ],
    type: 'scatter',
  }],
};

// use configuration item and data specified to show chart
myChart.setOption(option);

myChart.on('click', (d) => { console.log(d); });


const myChart2 = echarts.init(document.getElementById('scatterplot2'));
myChart2.setOption(option);
const myChart3 = echarts.init(document.getElementById('scatterplot3'));
myChart3.setOption(option);
