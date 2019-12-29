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
