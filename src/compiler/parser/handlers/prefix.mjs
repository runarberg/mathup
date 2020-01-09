import expr from "./expr.mjs";

export default function prefix({ start, tokens }) {
  const token = tokens[start];
  let next = expr({ stack: [], start: start + 1, tokens });

  if (next && next.node && next.node.type === "SpaceLiteral") {
    next = expr({ stack: [], start: next.end, tokens });
  }

  // XXX: Arity > 2 not implemented.
  if (token.arity === 2) {
    if (
      next &&
      next.node &&
      next.node.type === "FencedGroup" &&
      next.node.items.length === 2
    ) {
      let items = next.node.items.map(col =>
        col.length === 1 ? col[0] : { type: "Term", items: col },
      );

      if (token.name === "root") {
        items = items.reverse();
      }

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
    let second = next && expr({ stack: [], start: next.end, tokens });

    if (second && second.node && second.node.type === "SpaceLiteral") {
      second = expr({ stack: [], start: second.end, tokens });
    }

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
    // The operant is not a matrix.
    const items = next.node.items.map(col =>
      col.length === 1 ? col[0] : { type: "Term", items: col },
    );

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
