'use strict';
var _ = require('lodash');
var tap = require('tap');

var format = require('../lib/check/format.js');

tap.test('checkFormat with a valid template', function (t) {
  t.plan(1);
  var template = _.cloneDeep(require('./template.json'));
  return format.checkVersion(template).then(function (errors) {
    t.equal(errors.length, 0, 'has no errors');
  });
});

tap.test('checkFormat with no format version', function (t) {
  t.plan(2);
  var template = _.cloneDeep(require('./template.json'));
  _.unset(template, 'AWSTemplateFormatVersion');
  return format.checkVersion(template).then(function (errors) {
    t.equal(errors.length, 1, 'has one error');
    t.match(errors[0], /AWSTemplateFormatVersion/, 'includes the missing key');
  });
});
