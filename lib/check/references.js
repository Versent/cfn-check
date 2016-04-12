'use strict';
var _ = require('lodash');
// var log = require('debug')('cfn-check:check:references');
var verbose = require('debug')('cfn-check:check:references:verbose');
var Promise = require('bluebird');

var getReferences = function (template) {
  verbose('Getting references');
  var references = [];
  var traverse = function (o, parentPath) {
    _.forOwn(o, function (value, key) {
      var path = _.cloneDeep(parentPath) || [];
      if (_.isPlainObject(value)) {
        // Only add names to path (not array indexes).
        if (!_.isFinite(+key)) { path.push(key); }
        if (value.Ref) { // Is a Ref
          value.path = path;
          references.push(value);
        } else { // Is another object
          traverse(value, path);
        }
      } else if (_.isArray(value)) {
        traverse(value, path);
      }
    });
  };
  traverse(template);

  return new Promise(function (resolve) {
    resolve(references);
  });
};

var getParameters = function (template) {
  return Promise.resolve(_.keys(template.Parameters));
};

// http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html
var getPseudoParameters = function () {
  return Promise.resolve([
    'AWS::AccountId',
    'AWS::NotificationARNs',
    'AWS::NoValue',
    'AWS::Region',
    'AWS::StackId',
    'AWS::StackName'
  ]);
};

var getResources = function (template) {
  return Promise.resolve(_.keys(template.Resources));
};

var validate = function (references, parameters, resources, pseudoParameters) {
  var validRefs = _.concat(parameters, resources, pseudoParameters);
  var errors = [];
  return new Promise(function (resolve, reject) {
    _.each(references, function (r) {
      if (_.indexOf(validRefs, r.Ref) < 0) {
        errors.push(`${r.path.join('.')} ${r.Ref} is not a valid Ref`);
      }
    });
    if (errors.length === 0) {
      resolve(true);
    } else {
      var error = new Error('Invalid Refs');
      error.issues = errors;
      reject(error);
    }
  });
};

var areValid = function (template) {
  verbose('Validating template references');
  return Promise.join(
    getReferences(template),
    getParameters(template),
    getResources(template),
    getPseudoParameters(),
    validate);
};

module.exports.getReferences = getReferences;
module.exports.getParameters = getParameters;
module.exports.getResources = getResources;
module.exports.getPseudoParameters = getPseudoParameters;
module.exports.areValid = areValid;
