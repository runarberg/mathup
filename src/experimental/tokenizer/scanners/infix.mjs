const INFIX_MAP = new Map([
  ["^", "sup"],
  ["/", "frac"],
  ["_", "sub"],
  [".^", "over"],
  ["._", "under"],
]);

export default function(char, input, { start }) {
  if (char === ".") {
    const next = input[start + 1];
    const infix = INFIX_MAP.get(`.${next}`);

    if (infix) {
      const nextnext = input[start + 2];

      if (infix === ".^" && nextnext === "^") {
        return null;
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

    return {
      type: "infix",
      value: infix,
      end: start + 1,
    };
  }

  return null;
}
