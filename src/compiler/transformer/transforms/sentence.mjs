function pickNotNull(keys, obj) {
  if (!obj) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) =>
        keys.includes(key) && value !== null && typeof value !== "undefined",
    ),
  );
}

export default function sentence(node, transform, options) {
  const attrs = pickNotNull(["dir", "display"], options);

  return {
    tag: "math",
    attrs,
    childNodes: node.body.map(transform).filter(x => x !== null),
  };
}
