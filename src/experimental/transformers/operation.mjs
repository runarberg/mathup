export default function operation(node, transform) {
  const { open, close, ...attrs } = node.attrs || {};

  const opNode = {
    tag: `m${node.name}`,
    childNodes: node.items.map(transform),
    attrs,
  };

  if (open || close) {
    return {
      tag: "mrow",
      childNodes: [
        { tag: "mo", textContent: open, attrs: { fence: true } },
        opNode,
        { tag: "mo", textContent: close, attrs: { fence: true } },
      ],
    };
  }

  return opNode;
}
