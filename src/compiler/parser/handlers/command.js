import expr from "./expr.js";

/**
 * @typedef {import("../../tokenizer/index.js").Token} Token
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../index.js").BinaryOperation} BinaryOperation
 * @typedef {import("../index.js").TernaryOperation} TernaryOperation
 * @typedef {UnaryOperation | BinaryOperation | TernaryOperation} Operation
 * @typedef {import("../index.js").Term} Term
 */

/**
 * @param {Node} node
 * @param {string[]} transforms
 * @returns {Operation | Term}
 */
function insertTransformNode(node, transforms) {
  if (node.type === "Term" && node.items.length > 0) {
    // Only apply transform to first node.
    const [first, ...rest] = node.items;
    return {
      ...node,
      items: [insertTransformNode(first, transforms), ...rest],
    };
  }

  if (node.type === "BinaryOperation") {
    const [left, right] = node.items;
    return {
      ...node,
      items: [insertTransformNode(left, transforms), right],
    };
  }

  if (node.type === "TernaryOperation") {
    const [a, b, c] = node.items;
    return {
      ...node,
      items: [insertTransformNode(a, transforms), b, c],
    };
  }

  return {
    type: "UnaryOperation",
    name: "command",
    transforms,
    items: [node],
  };
}

/**
 * @param {import("../parse.js").State} state
 * @returns {{ node: Operation | Term; end: number }}
 */
export default function command(state) {
  const token = state.tokens[state.start];

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

  let pos = state.start + 1;
  let nextToken = state.tokens[pos];
  while (
    nextToken &&
    (nextToken.type === "command" || nextToken.type === "space")
  ) {
    if (nextToken.type === "command") {
      handleCommandToken(nextToken);
    }

    pos += 1;
    nextToken = state.tokens[pos];
  }

  const next = expr({
    ...state,
    stack: [],
    start: pos,
    nestLevel: state.nestLevel + 1,
    textTransforms,
  });

  if (textTransforms.length === 0) {
    // Only apply styles.
    return {
      node: {
        type: "UnaryOperation",
        name: "command",
        styles,
        items: [next.node],
      },
      end: next.end,
    };
  }

  const node = insertTransformNode(next.node, textTransforms);

  if (styles.size > 0) {
    return {
      node: {
        type: "UnaryOperation",
        name: "command",
        styles,
        items: [node],
      },
      end: next.end,
    };
  }

  return {
    node,
    end: next.end,
  };
}
