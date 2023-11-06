/* eslint-env browser */

const NS = "http://www.w3.org/1998/Math/MathML";

/**
 * @typedef {Required<import("./index.js").RenderOptions>} Options
 * @param {import("../transformer/index.js").Tag} node
 * @param {Options} options
 * @returns {Element | DocumentFragment}
 */
export default function toDOM(node, { bare }) {
  /** @type {Element | DocumentFragment} */
  let element;

  if (node.tag === "math" && bare) {
    element = document.createDocumentFragment();
  } else {
    element = document.createElementNS(NS, node.tag);
  }

  if (element instanceof Element && node.attrs) {
    for (const [name, value] of Object.entries(node.attrs)) {
      element.setAttribute(name, `${value}`);
    }
  }

  if (node.textContent) {
    element.textContent = node.textContent;
  }

  if (node.childNodes) {
    for (const childNode of node.childNodes) {
      if (childNode) {
        element.appendChild(toDOM(childNode, { bare: false }));
      }
    }
  }

  return element;
}
