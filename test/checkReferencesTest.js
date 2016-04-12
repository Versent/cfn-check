'use strict';
var tap = require('tap');

var check = require('../lib/check/references.js');

tap.test('getReferences', function (t) {
  var template = require('./template.json');
  check.getReferences(template).then(function (references) {
    t.equal(references.length, 25, 'gets all the refs');
    t.end();
  });
});

tap.test('getParameters', function (t) {
  var template = require('./template.json');
  check.getParameters(template).then(function (parameters) {
    t.equal(parameters.length, 4, 'gets all the params');
    t.ok(parameters.indexOf('SSHLocation') > -1, 'has SSHLocation parameter');
    t.end();
  });
});

tap.test('getPseudoParameters', function (t) {
  check.getPseudoParameters().then(function (pseudoparameters) {
    t.equal(pseudoparameters.length, 6, 'gets all the params');
    t.ok(pseudoparameters.indexOf('AWS::AccountId') > -1,
         'has AWS::AccountId parameter');
    t.end();
  });
});
