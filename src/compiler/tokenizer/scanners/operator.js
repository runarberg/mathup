import { KNOWN_OPS, isOperational } from "../lexemes.js";

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

/**
 * @type {import("./index.js").Scanner}
 */
export default function operatorScanner(char, input, { start }) {
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
      type: "operator",
      value: known.value,
      attrs: known.attrs,
      end: start + value.length,
    };
  }

  if (isOperational(char)) {
    return {
      type: "operator",
      value: char,
      end: start + char.length,
    };
  }

  return null;
}
