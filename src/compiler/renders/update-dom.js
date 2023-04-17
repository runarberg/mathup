import toDOM from "./to-dom.js";

// eslint-disable-next-line no-empty-function
function* nullIter() {}

function* zip(iterables) {
  const iterators = iterables.map((iterable) =>
    iterable ? iterable[Symbol.iterator]() : nullIter(),
  );

  while (true) {
    const next = iterators.map((iterator) => iterator.next());

    if (next.every(({ done }) => done)) {
      return;
    }

    yield next.map(({ value }) => value);
  }
}

export default function updateDOM(parent, node, options = {}) {
  if (!parent) {
    throw new Error("updateDOM called on null");
  }

  if (parent.tagName.toLowerCase() !== node.tag) {
    throw new Error("tag name mismatch");
  }

  if (!(node.tag === "math" && options.bare)) {
    const desiredAttrs = node.attrs || {};
    const removeAttrs = [];

    for (const attr of parent.attributes) {
      const newValue = desiredAttrs[attr.name];

      if (!newValue) {
        removeAttrs.push(attr.name);
      } else if (newValue !== attr.value) {
        parent.setAttribute(attr.name, newValue);
      }
    }

    for (const name of removeAttrs) {
      parent.removeAttribute(name);
    }

    for (const [name, value] of Object.entries(desiredAttrs)) {
      if (!parent.getAttribute(name)) {
        parent.setAttribute(name, value);
      }
    }
  }

  if (["mi", "mn", "mo", "mspace", "mtext"].includes(node.tag)) {
    if (parent.textContent !== node.textContent) {
      // eslint-disable-next-line no-param-reassign
      parent.textContent = node.textContent;
    }

    return;
  }

  // Collect in arrays to prevent the live updating from interfering
  // with the schedule.
  const appendChilds = [];
  const removeChilds = [];
  const replaceChilds = [];

  for (const [child, desired] of zip([parent.children, node.childNodes])) {
    if (!desired) {
      // parent.removeChild(child);
      removeChilds.push(child);
    } else if (!child) {
      // parent.appendChild(toDOM(desired, options));
      appendChilds.push(toDOM(desired, options));
    } else if (child.tagName.toLowerCase() !== desired.tag) {
      // parent.replaceChild(toDOM(desired, options), child);
      replaceChilds.push([child, toDOM(desired, options)]);
    } else {
      updateDOM(child, desired);
    }
  }

  for (const child of removeChilds) {
    parent.removeChild(child);
  }

  for (const child of appendChilds) {
    parent.appendChild(child);
  }

  for (const [oldChild, desired] of replaceChilds) {
    parent.replaceChild(desired, oldChild);
  }
}
