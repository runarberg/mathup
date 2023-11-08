#!/usr/bin/env node

import { createReadStream } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import mathup from "../src/index.js";

const argOptions = {
  bare: {
    type: "boolean",
    short: "b",
    default: false,
  },

  display: {
    type: "boolean",
    short: "d",
    default: false,
  },

  help: {
    type: "boolean",
    short: "h",
    default: false,
  },

  rtl: {
    type: "boolean",
    default: false,
  },

  decimalmark: {
    type: "string",
    short: "m",
  },

  colsep: {
    type: "string",
    short: "c",
  },

  rowsep: {
    type: "string",
    short: "r",
  },
};

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {import("node:stream").Writable} stream
 * @returns {Promise<void>}
 */
async function printHelp(stream) {
  await pipeline(createReadStream(path.join(DIRNAME, "usage.txt")), stream);
}

/**
 * @returns {void}
 */
async function main() {
  let argv;
  try {
    argv = parseArgs({
      options: argOptions,
      strict: true,
      allowPositionals: true,
    });
  } catch (error) {
    process.stderr.write(error.message);
    process.stderr.write("\n");

    if (error.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION") {
      await printHelp(process.stderr);
    }

    process.exit(1);
  }

  if (argv.values.help) {
    await printHelp(process.stdin);

    return;
  }

  /** @type {import("../src/index.js").Options} */
  const options = {
    bare: argv.values.bare,
    display: argv.values.display ? "block" : undefined,
    dir: argv.values.rtl ? "rtl" : undefined,
    decimalMark: argv.values.decimalmark,
    colSep: argv.values.colsep,
    rowSep: argv.values.rowsep,
  };

  if (argv.positionals.length > 0) {
    const input = argv.positionals.join(" ");

    process.stdout.write(mathup(String(input), options).toString());
    process.stdout.write("\n");

    return;
  }

  const input = (await process.stdin.toArray()).join("").trim();

  if (input.length > 0) {
    process.stdout.write(mathup(String(input), options).toString());
    process.stdout.write("\n");
  }
}

main();
