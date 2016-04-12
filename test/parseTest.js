'use strict';
var fs = require('fs');
var tap = require('tap');

var parse = require('../lib/parse.js');

tap.test('parse valid JSON', function (t) {
  var file = fs.readFileSync('test/sampleValidTemplate.json');
  return parse(file.toString()).then(function (template) {
    t.type(template, 'object', 'is an object');
    t.ok(template.Parameters, 'has Parameters');
  });
});

tap.test('parse invalid JSON', function (t) {
  t.plan(2);
  var file = fs.readFileSync('test/invalidTemplate.json');
  return parse(file.toString()).catch(function (error) {
    t.type(error, Error, 'has an error');
    t.match(error.message, /line 1/, 'includes the line number')
  });
});
