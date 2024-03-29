import { KNOWN_OPS, KNOWN_PARENS_OPEN, isPunctOpen } from "../lexemes.js";

/**
 * @param {string} partial
 * @returns {boolean}
 */
function parenOpenPotential(partial) {
  for (const [paren] of KNOWN_PARENS_OPEN) {
    if (paren.startsWith(partial)) {
      return true;
    }
  }

  return false;
}

/** @type {import("./index.js").Scanner} */
export default function parenOpenScanner(char, input, { start }) {
  let value = char;

  if (parenOpenPotential(value)) {
    let [nextChar] = input.slice(start + value.length);
    let nextValue = value + nextChar;

    while (nextChar && parenOpenPotential(nextValue)) {
      value += nextChar;
      [nextChar] = input.slice(start + value.length);
      nextValue = value + nextChar;
    }
  }

  {
    const [nextChar] = input.slice(start + value.length);
    const nextValue = value + nextChar;

    if (KNOWN_OPS.has(nextValue)) {
      return null;
    }
  }

  const known = KNOWN_PARENS_OPEN.get(value);

  if (known) {
    return {
      ...known,
      type: "paren.open",
      end: start + value.length,
    };
  }

  if (isPunctOpen(char)) {
    return {
      type: "paren.open",
      value: char,
      end: start + char.length,
    };
  }

  return null;
}
