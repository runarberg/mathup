import { KNOWN_PARENS_OPEN, isPunctOpen } from "../lexemes.mjs";

function parenOpenPotential(partial) {
  for (const [paren] of KNOWN_PARENS_OPEN) {
    if (paren.startsWith(partial)) {
      return true;
    }
  }

  return false;
}

export default function (char, input, { start }) {
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

  const known = KNOWN_PARENS_OPEN.get(value);

  if (known) {
    return {
      type: "paren.open",
      value: known.value,
      end: start + value.length,
    };
  }

  if (isPunctOpen(char)) {
    return {
      type: "paren.open",
      value,
      end: start + char.length,
    };
  }

  return null;
}
