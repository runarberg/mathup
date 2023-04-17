function notNull(x) {
  return x !== null;
}

export default function matrixGroup(node, transform) {
  const childNodes = [];

  if (node.attrs.open) {
    childNodes.push({
      tag: "mo",
      textContent: node.attrs.open,
      attrs: {
        fence: "true",
      },
    });
  }

  childNodes.push({
    tag: "mtable",
    childNodes: node.items.map((row) => ({
      tag: "mtr",
      childNodes: row.map((col) => ({
        tag: "mtd",
        childNodes: col.map(transform).filter(notNull),
      })),
    })),
  });

  if (node.attrs.close) {
    childNodes.push({
      tag: "mo",
      textContent: node.attrs.close,
      attrs: {
        fence: "true",
      },
    });
  }

  return {
    tag: "mrow",
    childNodes,
  };
}
