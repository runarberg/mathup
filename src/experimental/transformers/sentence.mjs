export default function sentence(node, transform, options) {
  const attrs = {};

  if (options && options.display) {
    attrs.display = options.display;
  }

  return {
    tag: "math",
    attrs,
    childNodes: node.body.map(transform).filter(x => x !== null),
  };
}
