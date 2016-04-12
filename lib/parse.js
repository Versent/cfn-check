'use strict';
var debug = require('debug')('cfn-check:parse');
var Promise = require('bluebird');
var jsonlint = require('jsonlint');

var parse = function (templateString) {
  return new Promise(function (resolve) {
    debug('Validating JSON');
    // NOTE: parse() throws Error if invalid JSON.
    var template = jsonlint.parse(templateString);
    resolve(template);
  });
};

module.exports = parse;
