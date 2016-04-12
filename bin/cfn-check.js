#!/usr/bin/env node
'use strict';
var program = require('commander');

program
  .version('1.0.0')
  .usage('[options] <file>')
  .option('-w, --watch', 'Watch template for changes')
  .parse(process.argv);

if (program.args.length < 1) { program.help(); }
if (program.watch) { console.log(`Watching ${program.args}... (not really)`); }

console.log(`Validating ${program.args[0]}`)
