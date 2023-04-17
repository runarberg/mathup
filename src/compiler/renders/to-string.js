function escapeTextContent(str) {
  return str.replace(/[&<]/g, (c) => {
    if (c === "&") {
      return "&amp;";
    }

    return "&lt;";
  });
}

function escapeAttrValue(str) {
  return str.replace(/"/g, "&quot;");
}

export default function toString(node, { bare } = {}) {
  const attrString = Object.entries(node.attrs || {})
    .map(([name, value]) => `${name}="${escapeAttrValue(`${value}`)}"`)
    .join(" ");

  const openContent = attrString ? `${node.tag} ${attrString}` : node.tag;

  if (node.textContent) {
    const textContent = escapeTextContent(node.textContent);
    return `<${openContent}>${textContent}</${node.tag}>`;
  }

  if (node.childNodes) {
    const content = node.childNodes.map(toString).join("");

    if (node.tag === "math" && bare) {
      return content;
    }

    return `<${openContent}>${content}</${node.tag}>`;
  }

  return `<${openContent} />`;
}
