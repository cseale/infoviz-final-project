import echarts from 'echarts';
import _ from 'lodash';
import store from './store';
import { COLORS } from './constants';

const worldMap = require('echarts/map/json/world.json');

echarts.registerMap('world', worldMap);

let max = -Infinity;
let min = Infinity;

const onClickHanders = [];


const option = {
  backgroundColor: '#fff',
  tooltip: {
    trigger: 'item',
    formatter(params) {
      let value = (`${params.value}`).split('.');
      value = `${value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      }.${value[1]}`;
      let flowType = store.getFlowType();
      flowType = flowType.charAt(0).toUpperCase() + flowType.substr(1);
      return `${flowType}: ${store.getCurrentStartYear()} - ${store.getCurrentEndYear()}<br/>${params.name} : ${value === 'NaN.undefined' ? 'Not Reported' : value}`.replace('.undefined', '');
    },
  },
  visualMap: {
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
  },
  series: [
    {
      name: `${store.getCountryCode()}`,
      type: 'map',
      mapType: 'world',
      roam: true,
      zoom: 5,
      center: [7.934967, 50.774546],
      itemStyle: {
        opacity: 1,
        emphasis: {
          areaColor: null,
          opacity: 1,
          label: {
            show: true,
            fontSize: 13,
            fontColor: null,
          },
          borderColor: null,
          borderWidth: 3,
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
  let tempMin = Infinity;
  let tempMax = -Infinity;
  mapData.forEach((itemOpt) => {
    if (itemOpt.value > tempMax) {
      tempMax = itemOpt.value;
    }
    if (itemOpt.value < tempMin) {
      tempMin = itemOpt.value;
    }
  });
  min = tempMin;
  max = tempMax;
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
  const countries = store.getCountries()
    .filter(c => c.countryId !== 'TOT' && !c.countryName.includes('AGG') && !c.countryName.includes('OTH'));
  countries.forEach((country) => {
    country.name = formatCountryName(country.countryName);
    let total = 0;
    data
      .filter(d => d.countryId === country.countryId)
      .forEach((d) => {
        total += _.get(d, `${store.getFlowType()}.total`, 0);
      });

    country.value = total;
    country.selected = country.countryId === store.getCountryCode();
  });
  return countries;
}

function filterMapData(data) {
  return data.filter(d => Number(d.year) <= store.getCurrentEndYear()
  && Number(d.year) >= store.getCurrentStartYear());
}

function renderMap(data) {
  myChart.setOption({
    visualMap: {
      min,
      max,
      inRange: {
        color: COLORS[store.getFlowType()],
      },
    },
    series: [
      {
        coordinateSystem: 'geo',
        data,
      },
    ],
  });
}

function updateMap() {
  const mapData = formatDataForMap(filterMapData(store.getData()));
  defineMaxAndMins(mapData);
  renderMap(mapData);
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
