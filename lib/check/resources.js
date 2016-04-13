'use strict';
var Promise = require('bluebird');

var areValid = function () {
  return Promise.resolve([]);
};

module.exports.areValid = areValid;
