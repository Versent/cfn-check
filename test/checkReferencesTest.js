'use strict';
var tap = require('tap');

var references = require('../lib/check/references.js');

tap.test('getReferences', function (t) {
  t.plan(1);
  var template = require('./template.json');
  return references.getReferences(template).then(function (refs) {
    t.equal(refs.length, 25, 'gets all the refs');
  });
});

tap.test('getParameters', function (t) {
  t.plan(2);
  var template = require('./template.json');
  return references.getParameters(template).then(function (params) {
    t.equal(params.length, 4, 'gets all the params');
    t.ok(params.indexOf('SSHLocation') > -1, 'has SSHLocation parameter');
  });
});

tap.test('getResources', function (t) {
  t.plan(2);
  var template = require('./template.json');
  return references.getResources(template).then(function (resources) {
    t.equal(resources.length, 9, 'gets all the params');
    t.ok(resources.indexOf('WebServerGroup') > -1,
         'has WebServerGroup resource');
  });
});

tap.test('getPseudoParameters', function (t) {
  t.plan(2);
  return references.getPseudoParameters().then(function (pseudos) {
    t.equal(pseudos.length, 6, 'gets all the params');
    t.ok(pseudos.indexOf('AWS::AccountId') > -1,
         'has AWS::AccountId parameter');
  });
});

tap.test('areValid with valid template', function (t) {
  t.plan(1);
  var template = require('./template.json');
  return references.areValid(template).then(function (errors) {
    t.equal(errors.length, 0, 'has no errors');
  });
});

tap.test('areValid with invalid template', function (t) {
  t.plan(3);
  var template = require('./template.json');
  template
    .Resources
    .WebServerGroup
    .Properties
    .LaunchConfigurationName
    .Ref = 'NotAValidRef';
  return references.areValid(template).then(function (errors) {
    var error = errors[0];
    t.equal(errors.length, 1, 'has one error')
    t.match(error, /NotAValidRef/, 'includes the invalid ref')
    t.match(error,
            /Resources\.WebServerGroup\.Properties\.LaunchConfigurationName/,
            'includes the path to ref')
  });
});

// TODO: Catch test.
