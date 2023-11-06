const INFIX_MAP = new Map([
  ["^", "sup"],
  ["/", "frac"],
  ["_", "sub"],
  [".^", "over"],
  ["._", "under"],
]);

/** @type {import("./index.js").Scanner} */
export default function infixScanner(char, input, { start }) {
  if (char === ".") {
    const next = input[start + 1];
    const infix = INFIX_MAP.get(`.${next}`);

    if (infix) {
      const nextnext = input[start + 2];

      if (infix === ".^" && nextnext === "^") {
        return null;
      }

      if (infix === "._") {
        if (
          (nextnext === "_" && input[start + 3] === "|") ||
          (nextnext === "|" && input[start + 3] === "_")
        ) {
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
    const next = input[start + 1];

    if ((char === "/" && next === "/") || (char === "^" && next === "^")) {
      return null;
    }

    if (char === "_") {
      if (
        (next === "_" && input[start + 2] === "|") ||
        (next === "|" && input[start + 2] === "_")
      ) {
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
