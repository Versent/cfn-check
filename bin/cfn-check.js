#!/usr/bin/env node
'use strict';
var _ = require('lodash');
var fs = require('fs');
var Promise = require('bluebird');
var program = require('commander');

program
  .version('1.0.0')
  .usage('[options] <template>')
  .option('-w, --watch', 'Watch template for changes')
  .option('-p, --pretty', 'Print pretty JSON when valid (regardless of character limit)')
  .option('-c, --compact', 'Print compact JSON when valid (regardless of character limit)')
  .parse(process.argv);

if (program.args.length < 1) { program.help(); }
if (program.watch) { console.log(`Watching ${program.args}... (not really)`); }

var parse = require('../lib/parse.js');
var check = require('../lib/check');

parse(fs.readFileSync(program.args[0], 'utf8')).then(function (template) {
  return Promise.join(
    check.references.areValid(template),
    check.resources.areValid(template),
    function (referencesErrors, resourcesErrors) {
      var errors = _.concat(referencesErrors, resourcesErrors);
      if (errors.length > 0) {
        console.log(errors.join('\n'));
        process.exit(1);
      } else {
        console.log(JSON.stringify(template, null, 2));
        process.exit(0);
      }
    });
})
.catch(function (error) {
  console.log(error.message);
  process.exit(1);
});
