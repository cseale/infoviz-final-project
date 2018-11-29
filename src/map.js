import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as topojson from 'topojson';
import * as d3GeoProjection from 'd3-geo-projection';
import isoCountries from 'i18n-iso-countries';

isoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

d3.tip = d3Tip;

var clickHandlers = [];

var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return 'My Tooltip'; });

var width = 1000,
    height = 700;

var color = d3.scaleThreshold()
    .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

var projection = d3GeoProjection.geoMiller()
    .scale(160)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geoPath()
    .projection(projection);

var graticule = d3.geoGraticule();

var svg = d3.select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(tip);

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



//data
//https://github.com/zcreativelabs/react-simple-maps/blob/master/topojson-maps/world-50m.json
//https://github.com/topojson/world-atlas


const promises = [
    d3.json('https://cdn.rawgit.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json'),
    d3.json('/datasets/Bi-Lateral%20Migration%201945-2011/DEMIG-C2C-migration-flows/DEMIG-C2C-Migration-Netflow.json')
];

Promise.all(promises)
    .then(ready);

function ready([world, flowData]) {
    var countries = topojson.feature(world, world.objects.countries).features,
        neighbors = topojson.neighbors(world.objects.countries.geometries);

    var flows = filterMigrationData(flowData.results);

    svg.selectAll('.country')
        .data(countries)
        .enter()
        .insert('path', '.graticule')
        .attr('class', 'country')
        .attr('d', path)
        .style("fill", function (d) { return color(1000000) })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity",0.8)
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('click', function(d) {
            update(d);
        })
        .on('mouseover', function (d) {
            tip.show(d, this);

            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3);
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 0.3);
        });
}

function update(data) {
    svg.selectAll('.country')
    .style("fill", function (d) { return color(1500000000) })
}


function filterMigrationData(flows) {
    flows.forEach(f => {
        const alphaCode = isoCountries.getAlpha2Code(f['Reporting country'], 'en');
        const numericCode = isoCountries.alpha2ToNumeric(alphaCode);
        f.isoCode = numericCode;
    });

    flows = flows.filter(f => f.Year === 2010);
    return flows;
}

function getFlow(flows, isoCode) {
    const results = flows.filter(f => f.isoCode === isoCode);
    console.log(isoCode, results.length)
    return results[0];
}


// update map data
export function updateMap(data) {
    update(data);
}

// add click handler
export function registerMapClickHandler(onClick) {
    clickHandlers.push(onClick);
}

// remove click handler
export function deregisterMapClickHandler(onClick) {
    var index = clickHandlers.indexOf(onClick);
    if (index > -1) {
        clickHandlers.splice(index, 1);
    }
}