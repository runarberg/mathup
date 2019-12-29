function notNull(node) {
  return node !== null;
}

export default function term(node, transform) {
  if (node.items.length === 1 && notNull(node.items[0])) {
    return transform(node.items[0]);
  }

  return {
    tag: "mrow",
    childNodes: node.items.map(transform).filter(notNull),
  };
}
