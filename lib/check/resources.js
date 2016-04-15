'use strict';
var _ = require('lodash');
var Promise = require('bluebird');

const customResourceTypeRegex = /^Custom::.*/;
const requiredPropertyRegex = /Required: Yes/i;

// Creates an object (keyed by resource name) of properties that are required.
var getRequiredProperties = function (resources) {
  var requiredProperties = {};
  _.each(resources, function (r) {
    requiredProperties[r.type] = [];
    _.each(r.properties, function (p, i) {
      var description = r.descriptions[i];
      if (requiredPropertyRegex.test(description)) {
        requiredProperties[r.type].push(p);
      }
    });
  });

  return Promise.resolve(requiredProperties);
};

var checkTypes = function (template) {
  return new Promise(function (resolve) {
    var resources = require('../../data/resources.json');
    var resourceTypes = _.map(resources, 'type');
    var errors = _(template.Resources)
      .map(function (r, name) {
        if (!r.Type.match(customResourceTypeRegex) &&
            (_.indexOf(resourceTypes, r.Type) < 0)) {
          return `${r.Type} is not a valid type for ${name}`;
        }
      })
     .compact()
     .value();
    resolve(errors);
  });
};

// Properties are validated at a template level (i.e. all Resources) in case
// there are dependencies between them (e.g. DependsOn).
var checkValidProperties = function (template) {
  return new Promise(function (resolve) {
    var resources = require('../../data/resources.json');
    var errors = _(template.Resources)
      .map(function (r, name) {
        var definition = _.find(resources, ['type', r.Type])
        // NOTE: Does not check properties if type is not recognised
        if (definition) {
          var properties = _.keys(r.Properties);
          return _.map(properties, function (p) {
            if (_.indexOf(definition.properties, p) < 0) {
              return `${p} is not a valid property for ${name} (${r.Type})`;
            }
          });
        }
      })
      .flatten()
      .compact()
      .value();
    resolve(errors);
  });
};

var areValid = function (template) {
  return Promise.join(
    checkTypes(template),
    checkValidProperties(template),
    function (typeErrors, propertiesErrors) {
      return (_.concat(typeErrors, propertiesErrors));
    });
};

module.exports.getRequiredProperties = getRequiredProperties;
module.exports.checkTypes = checkTypes;
module.exports.checkValidProperties = checkValidProperties;
module.exports.areValid = areValid;
