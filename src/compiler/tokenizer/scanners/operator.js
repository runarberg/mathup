/**
 * @typedef {import("./index.js").Token} Token
 */

import { KNOWN_COMMANDS, KNOWN_OPS, isOperational } from "../lexemes.js";

/**
 * @param {string} partial
 * @returns {boolean}
 */
function opsPotential(partial) {
  for (const [op] of KNOWN_OPS) {
    if (op.startsWith(partial)) {
      return true;
    }
  }

  return false;
}

/** @type {import("./index.js").Scanner} */
export default function operatorScanner(char, input, { start, grouping }) {
  let value = char;

  if (opsPotential(value)) {
    let [nextChar] = input.slice(start + value.length);
    let nextValue = value + nextChar;

    while (nextChar && opsPotential(nextValue)) {
      value += nextChar;
      [nextChar] = input.slice(start + value.length);
      nextValue = value + nextChar;
    }
  }

  const known = KNOWN_OPS.get(value);

  if (known) {
    return {
      type: known.sep && grouping ? "sep.col" : "operator",
      value: known.value,
      attrs: known.attrs,
      end: start + value.length,
    };
  }

  const command = KNOWN_COMMANDS.get(value);
  if (command) {
    return {
      type: "command",
      end: start + value.length,
      ...command,
    };
  }

  if (!isOperational(char)) {
    return null;
  }

  /** @type {Token & { end: number }} */
  const token = {
    type: "operator",
    value: char,
    end: start + char.length,
  };

  const isStretchy =
    char === "|" && input.at(start - 1) === " " && input.at(start + 1) === " ";

  if (isStretchy) {
    token.attrs = { stretchy: true };
  }

  return token;
}
