#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import minimist from "minimist";

import mathup from "../src/index.js";

const argv = minimist(process.argv.slice(2));

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

/**
 * @returns {void}
 */
function main() {
  let input;

  if (argv.h || argv.help) {
    fs.createReadStream(path.join(DIRNAME, "usage.txt"))
      .pipe(process.stdout)
      .on("close", () => {
        process.exit(1);
      });
    return;
  }

  /** @type {import("../src/index.js").Options} */
  const options = {
    bare: argv.b || argv.bare,
    display: argv.d || argv.display ? "block" : undefined,
    dir: argv.rtl ? "rtl" : undefined,
    decimalMark: argv.m || argv.decimalmark,
    colSep: argv.c || argv.colsep,
    rowSep: argv.r || argv.rowsep,
  };

  if (typeof argv._[0] === "string") {
    [input] = argv._;
    process.stdout.write(mathup(String(input), options).toString());
    process.stdout.write("\n");
  } else {
    process.stdin.on("readable", () => {
      input = process.stdin.read();
      if (input !== null) {
        process.stdout.write(mathup(String(input), options).toString());
        process.stdout.write("\n");
      }
    });
  }
}

main();
