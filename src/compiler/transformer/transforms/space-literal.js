/**
 * @typedef {import("../../parser/index.js").SpaceLiteral} SpaceLiteral
 * @type {import("../index.js").TransformFn<SpaceLiteral>}
 */
export default function spaceLiteral(node) {
  if ("width" in node.attrs && node.attrs.width === "0ex") {
    return null;
  }

  return {
    tag: "mspace",
    attrs: node.attrs,
  };
}
