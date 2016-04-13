'use strict';
var _ = require('lodash');
var Promise = require('bluebird');

var areValid = function (template) {
  var resources = require('../../data/resources.json');
  var resourceTypes = _.map(resources, 'type');
  var errors = _(template.Resources)
    .map(function (r, name) {
      if (_.indexOf(resourceTypes, r.Type) < 0) {
        return `${r.Type} is not a valid type for ${name}`;
      }
    })
   .compact()
   .value();
  return Promise.resolve(errors);
};

module.exports.areValid = areValid;
