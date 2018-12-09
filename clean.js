'use strict';

const fs = require('fs');
const _path = require('path');

process.chdir(__dirname); // make sure we are running in the current directory

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path)
      .forEach(function (file, index) {
        var curPath = path + '/' + file;
        curPath = _path.resolve(curPath);
        if (fs.lstatSync(curPath)
          .isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
    fs.rmdirSync(path);
  }
}

deleteFolderRecursive(_path.resolve("./dist"));
