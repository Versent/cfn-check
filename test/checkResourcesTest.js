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

tap.test('checkTypes with no resource type', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  _.unset(template, 'Resources.ElasticLoadBalancer.Type');
  return checkResources.checkTypes(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error');
    t.match(error, /ElasticLoadBalancer/, 'has the invalid Resource\'s name');
    t.match(error, /missing/i, 'is definied as missing');
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

tap.test('checkValidProperties with invalid resource property', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  var invalidProperty = 'NotAProperty';
  template.Resources.ElasticLoadBalancer.Properties[invalidProperty] = 'AValue';
  return checkResources.checkValidProperties(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error');
    t.match(error, /ElasticLoadBalancer/, 'has the invalid Resource\'s name');
    t.match(error, new RegExp(invalidProperty), 'has the invalid property\'s name');
  });
});

tap.test('getRequiredProperties generates required properties', function (t) {
  t.plan(2);
  var resources = require('../data/resources.json');
  checkResources.getRequiredProperties(resources).then(function (requiredProperties) {
    t.same(requiredProperties['AWS::AutoScaling::LaunchConfiguration'],
           ['ImageId', 'InstanceType'],
           'LaunchConfiguration has required properties ImageId and InstanceType');
    t.same(requiredProperties['AWS::WAF::Rule'],
           ['MetricName', 'Name'],
           'WAF::Rule has required properties MetricName and Name');
  });
})

tap.test('checkRequiredProperties with missing required property', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  _.unset(template, 'Resources.CPUAlarmLow.Properties.MetricName');
  checkResources.checkRequiredProperties(template).then(function (errors) {
    t.equal(errors.length, 1, 'has one error');
    t.match(errors[0], /CPUAlarmLow/, 'has the invalid Resource\'s name');
    t.match(errors[0], /MetricName/, 'has the missing property\'s name');
  });
});

tap.test('checkValidProperties with valid DependsOn reference');
tap.test('checkValidProperties with invalid DependsOn reference');
tap.test('checkValidProperties with valid DependsOn reference (multiple)');
tap.test('checkValidProperties with invalid DependsOn reference (multiple)');
tap.test('checkValidProperties with no conditional properties');
tap.test('checkValidProperties with multiple conditional properties');
tap.test('checkValidProperties with invalid property data type'); // e.g. Number vs String
// http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html
tap.test('checkValidProperties with CustomResource'); // Only ServiceToken is required

tap.test('areValid with valid template', function (t) {
  t.plan(1);
  var template = require('./template.json');
  return checkResources.areValid(template).then(function (errors) {
    t.equal(errors.length, 0, 'has no errors');
  });
});

tap.test('areValid with invalid resource type', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  var invalidType = template.Resources.ElasticLoadBalancer.Type = 'AWS::Not::A::Resource';
  return checkResources.areValid(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error');
    t.match(error, /ElasticLoadBalancer/, 'has the invalid Resource\'s name');
    t.match(error, new RegExp(invalidType), 'has the invalid type\'s name');
  });
});

tap.test('areValid with invalid resource property', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  var invalidProperty = 'NotAProperty';
  template.Resources.LaunchConfig.Properties[invalidProperty] = 'AValue';
  return checkResources.areValid(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error');
    t.match(error, /LaunchConfig/, 'has the invalid Resource\'s name');
    t.match(error, new RegExp(invalidProperty), 'has the invalid property\'s name');
  });
});

tap.test('areValid with missing required property', function (t) {
  t.plan(3);
  var template = _.cloneDeep(require('./template.json'));
  _.unset(template, 'Resources.CPUAlarmLow.Properties.MetricName');
  checkResources.areValid(template).then(function (errors) {
    t.equal(errors.length, 1, 'has one error');
    t.match(errors[0], /CPUAlarmLow/, 'has the invalid Resource\'s name');
    t.match(errors[0], /MetricName/, 'has the missing property\'s name');
  });
});

tap.test('areValid with invalid type and properties', function (t) {
  t.plan(5);
  var template = _.cloneDeep(require('./template.json'));
  var invalidType = template.Resources.ElasticLoadBalancer.Type = 'AWS::Not::A::Resource';
  var invalidProperty = 'NotAProperty';
  template.Resources.LaunchConfig.Properties[invalidProperty] = 'AValue';
  return checkResources.areValid(template).then(function (errors) {
    t.equal(errors.length, 2, 'has one error');
    // Type error
    t.match(errors[0], /ElasticLoadBalancer/, 'has the invalid Resource\'s name');
    t.match(errors[0], new RegExp(invalidType), 'has the invalid type\'s name');
    // Properties error
    t.match(errors[1], /LaunchConfig/, 'has the invalid Resource\'s name');
    t.match(errors[1], new RegExp(invalidProperty), 'has the invalid property\'s name');
  });
});

tap.test('areValid with an excpetion');
