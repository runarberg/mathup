/* eslint-env browser */

const NS = "http://www.w3.org/1998/Math/MathML";

export default function toDOM(node, { bare } = {}) {
  let element;

  if (node.tag === "math" && bare) {
    element = document.createDocumentFragment();
  } else {
    element = document.createElementNS(NS, node.tag);
  }

  if (node.attrs) {
    for (const [name, value] of Object.entries(node.attrs)) {
      element.setAttribute(name, value);
    }
  }

  if (node.textContent) {
    element.textContent = node.textContent;
  }

  if (node.childNodes) {
    for (const childNode of node.childNodes) {
      element.appendChild(toDOM(childNode));
    }
  }

  return element;
}
