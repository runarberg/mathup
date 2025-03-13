import { isDoublePipeOperator, isPipeOperator } from "../utils.js";

import expr from "./expr.js";

/**
 * @typedef {import("../../tokenizer/index.js").Token} Token
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../index.js").BinaryOperation} BinaryOperation
 * @typedef {import("../parse.js").State} State
 */

/**
 * @param {Node[]} nodes
 * @returns {Node}
 */
function toTermOrUnwrap(nodes) {
  if (nodes.length === 1) {
    return nodes[0];
  }

  return { type: "Term", items: nodes };
}

/**
 * @param {State} state
 * @returns {((token: Token) => boolean) | undefined}
 */
function maybeStopAtPipe({ start, tokens, stack, stopAt }) {
  if (stopAt) {
    return stopAt;
  }

  if (stack.length !== 1) {
    return undefined;
  }

  const token = tokens[start];
  if (!token || (token.arity && token.arity !== 1)) {
    return undefined;
  }

  const lastToken = start > 0 ? tokens[start - 1] : undefined;
  if (!lastToken || lastToken.type !== "operator") {
    return undefined;
  }

  if (lastToken.value === "|") {
    return isPipeOperator;
  }

  if (lastToken.value === "∥") {
    return isDoublePipeOperator;
  }

  return undefined;
}

/**
 * @param {import("../parse.js").State} state
 * @returns {{ node: UnaryOperation | BinaryOperation; end: number }}
 */
export default function prefix(state) {
  const { tokens, start } = state;
  const token = tokens[start];
  const nestLevel = state.nestLevel + 1;

  if (!token.name) {
    throw new Error("Got prefix token without a name");
  }

  const stopAt = maybeStopAtPipe(state);

  let next = expr({
    ...state,
    stack: [],
    start: start + 1,
    nestLevel,
    stopAt,
  });
  if (next && next.node && next.node.type === "SpaceLiteral") {
    next = expr({
      ...state,
      stack: [],
      start: next.end,
      nestLevel,
      stopAt,
    });
  }

  // XXX: Arity > 2 not implemented.
  if (token.arity === 2) {
    if (
      next &&
      next.node &&
      next.node.type === "FencedGroup" &&
      next.node.items.length === 2
    ) {
      const [first, second] = next.node.items;
      /** @type {[Node, Node]} */
      const items =
        token.name === "root"
          ? [toTermOrUnwrap(second), toTermOrUnwrap(first)]
          : [toTermOrUnwrap(first), toTermOrUnwrap(second)];

      return {
        node: {
          type: "BinaryOperation",
          name: token.name,
          attrs: token.attrs,
          items,
        },
        end: next.end,
      };
    }

    const first = next;
    let second =
      next &&
      expr({
        ...state,
        stack: [],
        start: next.end,
        nestLevel,
      });

    if (second && second.node && second.node.type === "SpaceLiteral") {
      second = expr({
        ...state,
        stack: [],
        start: second.end,
        nestLevel,
      });
    }

    /** @type {BinaryOperation} */
    const node = {
      type: "BinaryOperation",
      name: token.name,
      items: [first.node, second.node],
    };

    if (token.name === "root") {
      node.items = [second.node, first.node];
    }

    if (token.attrs) {
      node.attrs = token.attrs;
    }

    return {
      node,
      end: second.end,
    };
  }

  /** @type {UnaryOperation} */
  const node = {
    type: "UnaryOperation",
    name: token.name,
    items: [next.node],
  };

  if (token.accent) {
    node.accent = token.accent;
  }

  if (token.attrs) {
    node.attrs = token.attrs;
  }

  if (
    next &&
    next.node &&
    next.node.type === "FencedGroup" &&
    next.node.items.length === 1
  ) {
    // The operand is not a matrix.

    node.items = [toTermOrUnwrap(next.node.items[0])];
  }

  return {
    node,
    end: next.end,
  };
}
