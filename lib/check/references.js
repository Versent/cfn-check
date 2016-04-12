'use strict';
var _ = require('lodash');
var log = require('debug')('cfn-check:check:references');
var verbose = require('debug')('cfn-check:check:references:verbose');
var Promise = require('bluebird');

var getReferences = function (template) {
  log('Getting references');
  var references = [];
  var traverse = function (o) {
    _.forOwn(o, function (value, key) {
      var path = [key];
      verbose('Checking %s', path.join('.'));
      if (_.isPlainObject(value) || _.isArray(value)) {
        if (value.Ref) { // Is a Ref
          references.push(value);
        } else { // Is another object
          traverse(value);
        }
      }
    });
  };

  traverse(template);

  return new Promise(function (resolve) {
    resolve(references);
  });
};

module.exports.getReferences = getReferences;
