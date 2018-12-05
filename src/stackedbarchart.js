import echarts from 'echarts';

const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  legend: {
    data: ['Male', 'Female'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  series: [
    {
      name: '直接访问',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true,
          position: 'insideRight',
        },
      },
      data: [320, 302, 301, 334, 390, 330, 320, 300, 456, 122],
    },
    {
      name: '邮件营销',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true,
          position: 'insideRight',
        },
      },
      data: [120, 132, 101, 134, 90, 230, 210, 222, 322, 30],
    },
  ],
};

// based on prepared DOM, initialize echarts instance
const myChart1 = echarts.init(document.getElementById('stackedbar1'));
// use configuration item and data specified to show chart
myChart1.setOption(option);
