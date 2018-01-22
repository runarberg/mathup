#!/usr/bin/env node

"use strict";

var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

var ascii2mathml = require('../').default;

var ascii;

if (argv['h'] || argv['help']) {
  fs.createReadStream(__dirname + "/usage.txt")
    .pipe(process.stdout)
    .on("close", function() { process.exit(1); });
  return;
}

var options = {
  annotate: argv['a'] || argv['annotate'],
  bare: argv['b'] || argv['bare'],
  display: argv['d'] || argv['display'] ? "block" : "",
  dir: argv['rtl'] ? "rtl" : "",
  standalone: argv['s'] || argv['standalone'],
  decimalMark: argv['m'] || argv['decimalmark'] || ".",
  colSep: argv['c'] || argv['colsep'] || ",",
  rowSep: argv['r'] || argv['rowsep'] || ";"
};


if (typeof argv._[0] === "string") {
  ascii = argv._[0];
  process.stdout.write(ascii2mathml(String(ascii), options) + '\n');
}
else {
  process.stdin.on('readable', function() {
    ascii = process.stdin.read();
    if (ascii !== null) {
      process.stdout.write(ascii2mathml(String(ascii), options) + '\n');
    }
  });
}
