import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as d3GeoProjection from 'd3-geo-projection';

var width = 960,
  height = 580;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var projection = d3GeoProjection.geoKavrayskiy7()
  .scale(170)
  .translate([width / 2, height / 2])
  .precision(.1);

var path = d3.geoPath()
  .projection(projection);

var graticule = d3.geoGraticule();

var svg = d3.select('#map')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('defs')
  .append('path')
  .datum({ type: 'Sphere' })
  .attr('id', 'sphere')
  .attr('d', path);

svg.append('use')
  .attr('class', 'stroke')
  .attr('xlink:href', '#sphere');

svg.append('use')
  .attr('class', 'fill')
  .attr('xlink:href', '#sphere');

svg.append('path')
  .datum(graticule)
  .attr('class', 'graticule')
  .attr('d', path);

//data
//https://github.com/zcreativelabs/react-simple-maps/blob/master/topojson-maps/world-50m.json
//https://github.com/topojson/world-atlas


const promises = [
  d3.json('https://cdn.rawgit.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json'),
  d3.tsv('https://cdn.rawgit.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-country-names.tsv')
];

Promise.all(promises)
  .then(ready);

function ready([world, names]) {
  var countries = topojson.feature(world, world.objects.countries).features,
    neighbors = topojson.neighbors(world.objects.countries.geometries);

  //map country names to IDs used on map
  var arr = [];
  names.forEach(function (i) {
    arr[i.id] = i.name;
  });

  svg.selectAll('.country')
    .data(countries)
    .enter()
    .insert('path', '.graticule')
    .attr('class', 'country')
    .attr('d', path)
    .style('fill', function (d, i) {
      return color(d.color = d3.max(neighbors[i], function (n) {
        return countries[n].color;
      }) + 1 | 0);
    });
}
