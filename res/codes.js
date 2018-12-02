'use strict';

let raw = require("./codes.json");

// let _3 = {};
//
// for (let element of require("./3.json") ) {
//   _3[element['country-code']] = element['alpha-3']
// }

let byName = {}, byCC = {}, byId = {}, byCCPadding = {}, byId3 = {};

for (let element of raw ) {
  byName[element.name] = element;
  byId[element.id] = element;
  byCC[element.cc] = element;
  byCCPadding[element.ccPadding] = element;

  // element.id3 = _3[element.ccPadding];

  byId3[element.id3] = element;
}

// console.log(JSON.stringify(raw));

module.exports = {byName, byCC, byId, byCCPadding, byId3};

//
// let ret = require('./codes.json')
//   .map(e => {
//     return {
//       name: e.name,
//       id: e['alpha-2'],
//       cc: +e['country-code'],
//       ccPadding: e['country-code']
//     };
//   });
//
// console.log(JSON.stringify(ret));
