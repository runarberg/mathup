export default function literal(tag) {
  return node => ({
    tag,
    attrs: node.attrs,
    textContent: node.value,
  });
}
