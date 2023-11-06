/**
 * @typedef {import("../../parser/index.js").Node} Node
 * @typedef {import("../../parser/index.js").Term} Term
 * @typedef {import("../index.js").Tag} Tag
 */

/**
 * @template T
 * @param {T} node
 * @returns {boolean}
 */
function notNull(node) {
  return node !== null;
}

/** @type {import("../index.js").TransformFn<Term>} */
export default function term(node, transform) {
  if (node.items.length === 1 && notNull(node.items[0])) {
    return transform(node.items[0]);
  }

  return {
    tag: "mrow",
    childNodes: node.items.map(transform).filter(notNull),
  };
}
