/* eslint-env browser */

export default function toDOM(node) {
  const element = document.createElementNS(
    "http://www.w3.org/1998/Math/MathML",
    node.tag,
  );

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
