import expr from "./expr.js";

/**
 * @typedef {import("../../tokenizer/index.js").Token} Token
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

  /** @type {string[]} */
  const textTransforms = [];

  /** @type {Map<string, string>} */
  const styles = new Map();

  /**
   * @param {Token} token
   * @returns {void}
   */
  function handleCommandToken({ name, value }) {
    if (!value) {
      return;
    }

    if (name === "text-transform") {
      textTransforms.push(value);
    } else if (name) {
      styles.set(name, value);
    }
  }

  handleCommandToken(token);

  let pos = start + 1;
  let nextToken = tokens[pos];
  while (
    nextToken &&
    (nextToken.type === "command" || nextToken.type === "space")
  ) {
    if (nextToken.type === "command") {
      handleCommandToken(nextToken);
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
        styles,
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
      styles,
      items: [next.node],
    },
    end: next.end,
  };
}
