function canApplyVariant({ type }) {
  return (
    type === "IdentLiteral" ||
    type === "NumberLiteral" ||
    type === "OperatorLiteral" ||
    type === "TextLiteral"
  );
}

export default function unaryOperation(node, transform) {
  if (node.name === "fence") {
    const { open, close } = node.attrs;

    const childNodes = [
      { tag: "mo", attrs: { fence: true }, textContent: open },
      node.items.length === 1
        ? transform(node.items[0])
        : { tag: "mrow", childNodes: node.items.map(transform) },
      { tag: "mo", attrs: { fence: true }, textContent: close },
    ];

    return {
      tag: "mrow",
      childNodes,
    };
  }

  if (node.name === "style" && node.items.length === 1) {
    const addStyleAttrs = childNode => {
      if (canApplyVariant(childNode)) {
        return {
          ...childNode,
          attrs: {
            ...(childNode.attrs || {}),
            ...node.attrs,
          },
        };
      }

      if (childNode.items) {
        return {
          ...childNode,
          items: childNode.items.map(addStyleAttrs),
        };
      }

      if (Array.isArray(childNode)) {
        return childNode.map(addStyleAttrs);
      }

      return childNode;
    };

    return transform(addStyleAttrs(node.items[0]));
  }

  const tag = `m${node.name}`;

  const childNodes =
    node.items.length === 1
      ? [transform(node.items[0])]
      : [{ tag: "mrow", childNodes: node.items.map(transform) }];

  if (node.accent) {
    childNodes.push({
      tag: "mo",
      textContent: node.accent,
      attrs: { accent: true },
    });
  }

  return {
    tag,
    childNodes,
    attrs: node.attrs,
  };
}
