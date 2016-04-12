'use strict';
var verbose = require('debug')('cfn-check:parse:verbose');
var Promise = require('bluebird');
var jsonlint = require('jsonlint');

var parse = function (templateString) {
  return new Promise(function (resolve) {
    verbose('Validating JSON');
    // NOTE: parse() throws Error if invalid JSON.
    var template = jsonlint.parse(templateString);
    resolve(template);
  });
};

module.exports = parse;
