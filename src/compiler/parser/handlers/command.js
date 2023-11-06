import expr from "./expr.js";

/**
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../index.js").Term} Term
 */

/**
 * @param {import("../parse.js").State} State
 * @returns {{ node: UnaryOperation | Term; end: number }}
 */
export default function command({ start, tokens }) {
  const token = tokens[start];

  if (!token.name) {
    throw new Error("Got command token without a name");
  }

  const textTransforms = [];

  if (token.name === "text-transform" && token.value) {
    textTransforms.push(token.value);
  }

  let pos = start + 1;
  let nextToken = tokens[pos];
  while (
    nextToken &&
    (nextToken.type === "command" || nextToken.type === "space")
  ) {
    if (
      nextToken.type === "command" &&
      nextToken.name === "text-transform" &&
      token.value
    ) {
      textTransforms.push(nextToken.value);
    }

    pos += 1;
    nextToken = tokens[pos];
  }

  const next = expr({ stack: [], start: pos, tokens });

  if (next.node.type === "Term") {
    // Only apply command to the first item in the term
    const [first, ...rest] = next.node.items;

    /** @type {Node[]} */
    const items = first
      ? [
          {
            type: "UnaryOperation",
            name: "command",
            transforms: textTransforms,
            items: [first],
          },
          ...rest,
        ]
      : [];

    return {
      node: {
        type: "Term",
        items,
      },
      end: next.end,
    };
  }

  return {
    node: {
      type: "UnaryOperation",
      name: "command",
      transforms: textTransforms,
      items: [next.node],
    },
    end: next.end,
  };
}
