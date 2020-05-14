import expr from "./expr.mjs";

// XXX: I think that these attr functions belong in transforms.

function attrTextContent({ type, items }) {
  if (type !== "Term" || !items) {
    return "";
  }
  if (items.length !== 1) {
    return "";
  }

  const [{ type: itemType, value: itemValue }] = items;
  if (!itemType || !itemValue) {
    return "";
  }

  if (itemType === "NumberLiteral") {
    return `#${itemValue}`;
  }
  if (itemType === "IdentLiteral" || itemType === "TextLiteral") {
    return itemValue;
  }

  return "";
}

function attrSanitize(name, value) {
  const colorAttrs = ["mathcolors", "mathbackground"];
  if (colorAttrs.includes(name)) {
    return attrSanitizeColor(name, value);
  }
  return [name, value];
}

function attrSanitizeColor(name, value) {
  // See https://www.w3.org/TR/MathML3/chapter2.html#fund.color
  if (value.startsWith("#")) {
    const n = value.slice(1);
    // Either #RGB or #RRGGBB.
    if (n.length !== 3 && n.length !== 6) {
      return [];
    }
    for (const c of n) {
      // XXX: Perhaps I should stick to the eslint code style,
      // but the no-continue rule is kinda weird.
      /* eslint-disable no-continue */
      if (c >= "0" && c <= "9") {
        continue;
      }
      if (c >= "A" && c <= "F") {
        continue;
      }
      if (c >= "a" && c <= "f") {
        continue;
      }
      /* eslint-enable no-continue */
      // Not a hex digit, remove this attribute.
      return [];
    }
    return [name, value];
  }
  const htmlColors = [
    "aqua",
    "black",
    "blue",
    "fuchsia",
    "gray",
    "green",
    "lime",
    "maroon",
    "navy",
    "olive",
    "purple",
    "red",
    "silver",
    "teal",
    "white",
    "yellow",
  ];
  if (htmlColors.includes(value.toLowerCase())) {
    return [name, value];
  }
  if (name === "mathbackground" && value === "transparent") {
    return [name, value];
  }
  return [];
}

export default function prefix({ start, tokens }) {
  const token = tokens[start];

  let next = expr({ stack: [], start: start + 1, tokens });
  if (next.node.type === "SpaceLiteral") {
    next = expr({ stack: [], start: next.end, tokens });
  }

  let { arity } = token;
  if (!arity) {
    arity = 1;
  }

  let items;
  if (next.node.type === "FencedGroup" && next.node.items.length === arity) {
    // The operant is not a matrix.
    items = next.node.items.map((col) =>
      col.length === 1 ? col[0] : { type: "Term", items: col },
    );
  } else {
    items = [next.node];
    for (let i = 1; i < arity; i += 1) {
      next = expr({ stack: [], start: next.end, tokens });
      if (next.node.type === "SpaceLiteral") {
        next = expr({ stack: [], start: next.end, tokens });
      }
      items.push(next.node);
    }
  }
  if (token.name === "root") {
    items = items.reverse();
  }

  let type = "BinaryOperation";
  if (arity === 1) {
    type = "UnaryOperation";
  }

  let { attrs } = token;
  if (token.attrName) {
    // Keep this as BinaryOperation even though it’s not,
    // because UnaryOperation transformation *recursively*
    // applies style attributes to child nodes.

    const [valueNode, ...rest] = items;
    items = rest;

    let name = token.attrName;
    let value = attrTextContent(valueNode);
    [name, value] = attrSanitize(name, value);

    if (name && value) {
      attrs = { ...attrs };
      attrs[name] = value;
    }
  }

  return {
    node: {
      type,
      name: token.name,
      accent: token.accent,
      attrs,
      items,
    },
    end: next.end,
  };
}
