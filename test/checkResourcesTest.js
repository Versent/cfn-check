'use strict';
var tap = require('tap');

var checkResources = require('../lib/check/resources.js');


tap.test('areValid with valid template', function (t) {
  t.plan(1);
  var template = require('./template.json');
  return checkResources.areValid(template).then(function (errors) {
    t.equal(errors.length, 0, 'no errors');
  });
});
