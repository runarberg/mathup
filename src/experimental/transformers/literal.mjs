export default function literal(tag) {
  return node => ({
    tag,
    textContent: node.value,
  });
}
