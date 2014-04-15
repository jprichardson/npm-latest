'use strict';

var npmLatest = require('./../lib/npm-latest.js');

npmLatest('express', function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result.name + ' v'+ result.version);
});