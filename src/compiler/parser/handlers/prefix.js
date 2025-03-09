import expr from "./expr.js";

/**
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../index.js").BinaryOperation} BinaryOperation
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

  let next = expr({
    ...state,
    stack: [],
    start: start + 1,
    nestLevel,
  });
  if (next && next.node && next.node.type === "SpaceLiteral") {
    next = expr({
      ...state,
      stack: [],
      start: next.end,
      nestLevel,
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

    /** @type {[Node, Node]} */
    const items =
      token.name === "root"
        ? [second.node, first.node]
        : [first.node, second.node];

    return {
      node: {
        type: "BinaryOperation",
        name: token.name,
        attrs: token.attrs,
        items,
      },
      end: second.end,
    };
  }

  if (
    next &&
    next.node &&
    next.node.type === "FencedGroup" &&
    next.node.items.length === 1
  ) {
    // The operand is not a matrix.
    /** @type {[Node]} */
    const items = [toTermOrUnwrap(next.node.items[0])];

    return {
      node: {
        type: "UnaryOperation",
        name: token.name,
        accent: token.accent,
        attrs: token.attrs,
        items,
      },
      end: next.end,
    };
  }

  return {
    node: {
      type: "UnaryOperation",
      name: token.name,
      accent: token.accent,
      attrs: token.attrs,
      items: [next.node],
    },
    end: next.end,
  };
}
