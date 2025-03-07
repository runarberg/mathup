import {
  KNOWN_COMMANDS,
  KNOWN_IDENTS,
  KNOWN_OPS,
  KNOWN_PARENS_CLOSE,
  KNOWN_PARENS_OPEN,
  KNOWN_PREFIX,
} from "../lexemes.js";

const INFIX_MAP = new Map([
  ["^", "sup"],
  ["/", "frac"],
  ["_", "sub"],
  [".^", "over"],
  ["._", "under"],
]);

/** @type {Set<string>} */
const COLLISIONS = new Set();

for (const map of [
  KNOWN_COMMANDS,
  KNOWN_IDENTS,
  KNOWN_OPS,
  KNOWN_PARENS_CLOSE,
  KNOWN_PARENS_OPEN,
  KNOWN_PREFIX,
]) {
  for (const key of map.keys()) {
    if ("^/_".includes(key[0])) {
      COLLISIONS.add(key);
    }
  }
}

/** @type {import("./index.js").Scanner} */
export default function infixScanner(char, input, { start }) {
  if (char === ".") {
    const next = input[start + 1];
    const infix = INFIX_MAP.get(`.${next}`);

    if (infix) {
      for (const key of COLLISIONS) {
        if (key === input.slice(start + 1, start + 1 + key.length)) {
          return null;
        }
      }

      return {
        type: "infix",
        value: infix,
        end: start + 2,
      };
    }
  }

  const infix = INFIX_MAP.get(char);

  if (infix) {
    for (const key of COLLISIONS) {
      if (key === input.slice(start, start + key.length)) {
        return null;
      }
    }

    return {
      type: "infix",
      value: infix,
      end: start + 1,
    };
  }

  return null;
}
