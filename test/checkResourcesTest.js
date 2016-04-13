'use strict';
var tap = require('tap');

var checkResources = require('../lib/check/resources.js');

tap.test('areValid with valid template', function (t) {
  t.plan(1);
  var template = require('./template.json');
  return checkResources.areValid(template).then(function (errors) {
    t.equal(errors.length, 0, 'has no errors');
  });
});

tap.test('areValid with invalid resource type', function (t) {
  t.plan(3);
  var template = require('./template.json');
  var invalidType = template.Resources.ElasticLoadBalancer.Type = 'AWS::Not::A::Resource';
  return checkResources.areValid(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error');
    t.match(error, /ElasticLoadBalancer/, 'has the invalid Resource\'s name');
    t.match(error, new RegExp(invalidType), 'has the invalid type\'s name');
  });
});

// tap.test('areValid with invalid resource property', function (t) {
//   t.plan(2);
//   var template = require('./template.json');
//   var invalidProperty = template.Resources.ElasticLoadBalancer.Type = 'NotAProperty';
//   return checkResources.areValid(template).then(function (errors) {
//     var error = errors[0];
//     t.equal(errors.length, 1, 'has one error');
//     t.match(error, new RegExp(invalidProperty), 'has the invalid property\'s name');
//   });
// });

// TODO: work out required properties
// TODO: allow optional properties or not
// TODO: Conditional properties (!)
