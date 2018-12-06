import echarts from 'echarts';
import store from './store';

const worldMap = require('echarts/map/json/world.json');

echarts.registerMap('world', worldMap);

let max = -Infinity;
let min = Infinity;
const selectedIndex = null;

const onClickHanders = [];

const diveringScheme = ['rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(247,247,247)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)', 'rgb(5,48,97)'];

const colorSchemes = {
  outflow: diveringScheme.slice(5),
  inflow: diveringScheme.slice(5).reverse(),
  netflow: diveringScheme,
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
      return `${params.seriesName}<br/>${params.name} : ${value}`.replace('.undefined', '');
    },
  },
  visualMap: {
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: colorSchemes.outflow,
    },
  },
  series: [
    {
      name: 'World Migration Outflow (1980)',
      type: 'map',
      mapType: 'world',
      roam: true,
      zoom: 5,
      selectedMode: 'single',
      center: [7.934967, 50.774546],
      itemStyle: {
        opacity: 1,
        emphasis: {
          areaColor: null,
          opacity: 0.8,
          label: {
            show: true,
          },
          borderColor: 'red',
          borderWidth: 2,
        },
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
  data = formatDataForMap(store.getData());
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
