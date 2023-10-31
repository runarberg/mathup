/**
 * @typedef {import("../../parser/index.js").Sentence} Sentence
 * @type {import("../index.js").TransformFn<Sentence>}
 */
export default function sentence(node, transform, options) {
  /** @type {Record<string, string>} */
  const attrs = {};

  if (options.dir) {
    attrs.dir = options.dir;
  }

  if (options.display) {
    attrs.display = options.display;
  }

  return {
    tag: "math",
    attrs,
    childNodes: node.body.map(transform).filter((x) => x !== null),
  };
}
