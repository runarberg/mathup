/**
 * @typedef {import("../../parser/index.js").SpaceLiteral} SpaceLiteral
 * @type {import("../index.js").TransformFn<SpaceLiteral>}
 */
export default function spaceLiteral(node) {
  if (node.attrs.width === "0ex") {
    // No 0 width whitespace.
    return null;
  }

  return {
    tag: "mspace",
    attrs: node.attrs,
  };
}
