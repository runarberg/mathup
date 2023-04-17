export default function spaceLiteral(node) {
  if (node.attrs.width === "0ex") {
    return null;
  }

  return {
    tag: "mspace",
    attrs: node.attrs,
  };
}
