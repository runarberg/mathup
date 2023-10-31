/**
 * @param {string} str
 * @returns {string}
 */
function escapeTextContent(str) {
  return str.replace(/[&<]/g, (c) => {
    if (c === "&") {
      return "&amp;";
    }

    return "&lt;";
  });
}

/**
 * @param {string} str
 * @returns {string}
 */
function escapeAttrValue(str) {
  return str.replace(/"/g, "&quot;");
}

/**
 * @param {import("../transformer/index.js").Tag} node
 * @param {Required<import("./index.js").RenderOptions>} options
 * @returns {string}
 */
export default function toString(node, { bare }) {
  const attrString = Object.entries(node.attrs || {})
    .map(([name, value]) => `${name}="${escapeAttrValue(`${value}`)}"`)
    .join(" ");

  const openContent = attrString ? `${node.tag} ${attrString}` : node.tag;

  if (node.textContent) {
    const textContent = escapeTextContent(node.textContent);
    return `<${openContent}>${textContent}</${node.tag}>`;
  }

  if (node.childNodes) {
    const content = node.childNodes
      .map((child) => (child ? toString(child, { bare: false }) : ""))
      .join("");

    if (node.tag === "math" && bare) {
      return content;
    }

    return `<${openContent}>${content}</${node.tag}>`;
  }

  return `<${openContent} />`;
}
