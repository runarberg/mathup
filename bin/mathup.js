#!/usr/bin/env node

"use strict";

var fs = require("fs");
var argv = require("minimist")(process.argv.slice(2));

var mathup = require("../");

var input;

if (argv["h"] || argv["help"]) {
  fs.createReadStream(__dirname + "/usage.txt")
    .pipe(process.stdout)
    .on("close", function() {
      process.exit(1);
    });
  return;
}

var options = {
  display: argv["d"] || argv["display"] ? "block" : undefined,
  dir: argv["rtl"] ? "rtl" : undefined,
  decimalMark: argv["m"] || argv["decimalmark"],
  colSep: argv["c"] || argv["colsep"],
  rowSep: argv["r"] || argv["rowsep"],
};

if (typeof argv._[0] === "string") {
  input = argv._[0];
  process.stdout.write(mathup(String(input), options).toString() + "\n");
} else {
  process.stdin.on("readable", function() {
    input = process.stdin.read();
    if (ascii !== null) {
      process.stdout.write(mathup(String(input), options).toString() + "\n");
    }
  });
}
