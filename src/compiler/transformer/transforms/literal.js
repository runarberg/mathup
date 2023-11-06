/**
 * @typedef {import("../../parser/index.js").Literal} Literal
 * @typedef {import("../../parser/index.js").SpaceLiteral} SpaceLiteral
 */

/**
 * @param {string} tag
 * @returns {import("../index.js").TransformFn<
 *   Exclude<Literal, SpaceLiteral>
 * >}
 */
export default function literal(tag) {
  return (node) => {
    return {
      tag,
      attrs: node.attrs,
      textContent: node.value,
    };
  };
}
