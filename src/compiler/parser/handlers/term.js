import { maybeFixDoublePipe } from "../utils.js";

import handlers from "./index.js";

/**
 * @typedef {import("../index.js").IdentLiteral} IdentLiteral
 * @typedef {import("../index.js").Literal} Literal
 * @typedef {import("../index.js").LiteralAttrs} LiteralAttrs
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").OperatorLiteral} OperatorLiteral
 * @typedef {import("../index.js").Term} Term
 * @typedef {import("../index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../parse.js").State} State
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
 * @param {string[]} [textTransforms]
 * @returns {void}
 */
function maybeFixDifferential(items, textTransforms) {
  // We may want to make the differnetial d operator an actual
  // operator to fix some spacing during integration.
  if (items.length < 2) {
    return;
  }

  const [first, second] = items;

  if (first.type !== "IdentLiteral" || first.value !== "d") {
    return;
  }

  let operand = second;
  while (
    operand.type === "UnaryOperation" ||
    operand.type === "BinaryOperation" ||
    operand.type === "TernaryOperation"
  ) {
    [operand] = operand.items;
  }

  if (operand.type !== "IdentLiteral") {
    return;
  }

  const value = (textTransforms?.length ?? 0) > 0 ? first.value : "𝑑";

  /** @type {OperatorLiteral & { attrs: LiteralAttrs }} */
  const node = {
    ...items[0],
    type: "OperatorLiteral",
    value,
    attrs: {
      ...(first.attrs ?? {}),
      rspace: "0",
    },
  };

  items[0] = node;
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

  while (
    token &&
    KEEP_GOING_TYPES.includes(token.type) &&
    // Perhaps the parent handler wants to use this token.
    !state.stopAt?.(token)
  ) {
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

  maybeFixDifferential(items, state.textTransforms);
  maybeFixDoublePipe(items);

  return {
    node: {
      type: "Term",
      items,
    },
    end: i,
  };
}
