'use strict';
var _ = require('lodash');
var tap = require('tap');

var checkResources = require('../lib/check/resources.js');

tap.test('checkTypes with valid template', function (t) {
  t.plan(1);
  var template = _.cloneDeep(require('./template.json'));
  return checkResources.checkTypes(template).then(function (errors) {
    t.equal(errors.length, 0, 'has no errors');
  });
});

tap.test('checkTypes with invalid resource type', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  var invalidType = template.Resources.ElasticLoadBalancer.Type = 'AWS::Not::A::Resource';
  return checkResources.checkTypes(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error');
    t.match(error, /ElasticLoadBalancer/, 'has the invalid Resource\'s name');
    t.match(error, new RegExp(invalidType), 'has the invalid type\'s name');
  });
});

tap.test('checkTypes with custom resource', function (t) {
  t.plan(1);
  var template = _.cloneDeep(require('./template.json'));
  // Example taken from CustomResource Type Reference
  template.Resources.MyFrontEndTest = {
    'Type': 'Custom::Thing',
    'Version': '1.0',
    'Properties': {
      'ServiceToken': 'arn:aws:sns:us-east-1:84969EXAMPLE:CRTest',
      'key1': 'string',
      'key2': [
        'list'
      ],
      'key3': {
        'key4': 'map'
      }
    }
  }
  return checkResources.checkTypes(template).then(function (errors) {
    t.equal(errors.length, 0, 'has no errors');
  });
});

tap.test('checkProperties with invalid resource property', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  var invalidProperty = 'NotAProperty';
  template.Resources.ElasticLoadBalancer.Properties[invalidProperty] = 'AValue';
  return checkResources.checkProperties(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error');
    t.match(error, /ElasticLoadBalancer/, 'has the invalid Resource\'s name');
    t.match(error, new RegExp(invalidProperty), 'has the invalid property\'s name');
  });
});

tap.test('checkProperties with missing required property');
tap.test('checkProperties with valid DependsOn reference');
tap.test('checkProperties with invalid DependsOn reference');
tap.test('checkProperties with valid DependsOn reference (multiple)');
tap.test('checkProperties with invalid DependsOn reference (multiple)');
tap.test('checkProperties with no conditional properties');
tap.test('checkProperties with multiple conditional properties');
tap.test('checkProperties with invalid property data type'); // e.g. Number vs String
// http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html
tap.test('checkProperties with CustomResource'); // Only ServiceToken is required
tap.test('areValid with valid template');
tap.test('areValid with invalid type');
tap.test('areValid with invalid properties');
tap.test('areValid with invalid type and properties');
tap.test('areValid with an excpetion');
