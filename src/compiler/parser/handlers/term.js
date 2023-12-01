import handlers from "./index.js";

/**
 * @typedef {import("../parse.js").State} State
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").Term} Term
 * @typedef {import("../index.js").IdentLiteral} IdentLiteral
 * @typedef {import("../index.js").OperatorLiteral} OperatorLiteral
 * @typedef {import("../index.js").Literal} Literal
 */

const KEEP_GOING_TYPES = [
  "command",
  "ident",
  "infix",
  "number",
  "operator",
  "paren.open",
  "prefix",
  "text",
];

/**
 * @param {Node[]} items
 * @returns {items is [IdentLiteral | OperatorLiteral, ...Node[]]}
 */
function isDifferential(items) {
  if (items.length < 2) {
    return false;
  }

  const [first, second] = items;

  if (first.type !== "IdentLiteral" || first.value !== "d") {
    return false;
  }

  let operant = second;
  while (
    operant.type === "UnaryOperation" ||
    operant.type === "BinaryOperation" ||
    operant.type === "TernaryOperation"
  ) {
    [operant] = operant.items;
  }

  return operant.type === "IdentLiteral";
}

/**
 * @param {State} state
 * @returns {{ node: Term; end: number }}
 */
export default function term(state) {
  let i = state.start;
  let token = state.tokens[i];
  /** @type {Node[]} */
  const items = [];

  while (token && KEEP_GOING_TYPES.includes(token.type)) {
    const handler = handlers.get(token.type);

    if (!handler) {
      throw new Error("Unknown Hander");
    }

    const next = handler({
      ...state,
      start: i,
      stack: items,
    });

    items.push(next.node);

    i = next.end;
    token = state.tokens[i];
  }

  if (isDifferential(items)) {
    // Special case differential operator.
    const value =
      (state.textTransforms?.length ?? 0) > 0 ? items[0].value : "𝑑";

    items[0] = {
      ...items[0],
      type: "OperatorLiteral",
      value,
      attrs: {
        ...(items[0].attrs || {}),
        rspace: "0",
      },
    };
  }

  return {
    node: {
      type: "Term",
      items,
    },
    end: i,
  };
}
