import echarts from 'echarts';

const worldMap = require('echarts/map/json/world.json');

echarts.registerMap('world', worldMap);

let max = -Infinity;
let min = Infinity;

const onClickHanders = [];

const colorSchemes = {
  outflow: ['rgb(237,248,251)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(44,162,95)', 'rgb(0,109,44)'],
  inflow: ['rgb(84,48,5)', 'rgb(140,81,10)', 'rgb(191,129,45)', 'rgb(223,194,125)', 'rgb(246,232,195)', 'rgb(245,245,245)'].reverse(),
  netflow: ['rgb(84,48,5)', 'rgb(140,81,10)', 'rgb(191,129,45)', 'rgb(223,194,125)', 'rgb(246,232,195)', 'rgb(245,245,245)', 'rgb(199,234,229)', 'rgb(128,205,193)', 'rgb(53,151,143)', 'rgb(1,102,94)', 'rgb(0,60,48)'],
};

const option = {
  backgroundColor: '#fff',
  title: {
    text: 'World Migration Outflow (1980)',
    left: 'center',
    top: 'top',
    textStyle: {
      color: '#fff',
    },
  },
  tooltip: {
    trigger: 'item',
    formatter(params) {
      let value = (`${params.value}`).split('.');
      value = `${value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      }.${value[1]}`;
      return `${params.seriesName}<br/>${params.name} : ${value}`;
    },
  },
  visualMap: {
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: colorSchemes.netflow,
    },
  },
  series: [
    {
      name: 'World Migration Outflow (1980)',
      type: 'map',
      mapType: 'world',
      roam: false,
      itemStyle: {
        emphasis: { label: { show: true } },
      },
    },
  ],
};

// based on prepared DOM, initialize echarts instance
const myChart = echarts.init(document.getElementById('map'));
// use configuration item and data specified to show chart
myChart.setOption(option);

myChart.on('click', (data) => {
  onClickHanders.forEach(handler => handler(data.data.countryId));
});

function defineMaxAndMins(mapData) {
  mapData.forEach((itemOpt) => {
    if (itemOpt.value > max) {
      max = itemOpt.value;
    }
    if (itemOpt.value < min) {
      min = itemOpt.value;
    }
  });
}

function formatCountryName(name) {
  const countryMapping = {
    'United States of America': 'United States',
    'Russian Federation': 'Russia',
    'Libyan Arab Jamahiriya': 'Libya',
    'Czech Republic': 'Czech Rep.',
    'Iran, Islamic Republic of': 'Iran',
    'Cote d\'Ivoire': 'Cote d\'Ivoire',
    Congo: 'Congo, Dem. Rep.',
  };
  const result = countryMapping[name] ? countryMapping[name] : name;
  return result.trim();
}

function formatDataForMap(data) {
  data.forEach((d) => {
    d.code = d.countryId;
    d.name = formatCountryName(d.countryName);
  });
  return data;
}

function filterMapData(data, year) {
  return data.filter(d => d.year === year);
}

function renderMap(data) {
  myChart.setOption({
    visualMap: {
      min,
      max,
    },
    series: [
      {
        coordinateSystem: 'geo',
        data,
      },
    ],
  });
}

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function playData(data) {
  for (let i = 1981; i < 2008; i += 1) {
    await sleep(1000);
    renderMap(filterMapData(data, i));
  }
}

function updateMap(data) {
  data = formatDataForMap(data);
  const mapData = filterMapData(data, 1980);
  defineMaxAndMins(mapData);
  renderMap(mapData);
  // playData(data);
}

function registerOnClickHandler(onClick) {
  onClickHanders.push(onClick);
  return onClick;
}

function deregisterOnClickHandler(onClick) {
  const index = onClickHanders.indexOf(onClick);
  if (index > -1) {
    onClickHanders.splice(index, 1);
  }
}

export default {
  updateMap,
  registerOnClickHandler,
  deregisterOnClickHandler,
};
