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
