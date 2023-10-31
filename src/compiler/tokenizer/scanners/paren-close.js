import { KNOWN_PARENS_CLOSE, isPunctClose } from "../lexemes.js";

/**
 * @param {string} partial
 * @returns {boolean}
 */
function parenClosePotential(partial) {
  for (const [paren] of KNOWN_PARENS_CLOSE) {
    if (paren.startsWith(partial)) {
      return true;
    }
  }

  return false;
}

/**
 * @type {import("./index.js").Scanner}
 */
export default function parenCloseScanner(char, input, { grouping, start }) {
  if (!grouping) {
    return null;
  }

  let value = char;

  if (parenClosePotential(value)) {
    let [nextChar] = input.slice(start + value.length);
    let nextValue = value + nextChar;

    while (nextChar && parenClosePotential(nextValue)) {
      value += nextChar;
      [nextChar] = input.slice(start + value.length);
      nextValue = value + nextChar;
    }
  }

  const known = KNOWN_PARENS_CLOSE.get(value);

  if (known) {
    return {
      type: "paren.close",
      value: known.value,
      end: start + value.length,
    };
  }

  if (isPunctClose(char)) {
    return {
      type: "paren.close",
      value: char,
      end: start + char.length,
    };
  }

  return null;
}
