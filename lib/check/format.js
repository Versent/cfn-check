'use strict';
var _ = require('lodash');
var Promise = require('bluebird');

var checkVersion = function (template) {
  return new Promise(function (resolve) {
    var errors = [];
    if (!_.has(template, 'AWSTemplateFormatVersion')) {
      errors.push('Missing suggested "AWSTemplateFormatVersion" property');
    }
    resolve(errors);
  });
}

module.exports.checkVersion = checkVersion;
