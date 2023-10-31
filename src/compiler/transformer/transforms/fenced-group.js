/**
 * @typedef {import("../../parser/index.js").FencedGroup} FencedGroup
 */

/**
 * @param {import("../index.js").Tag | null} tag
 * @returns {boolean}
 */
function notNull(tag) {
  return tag !== null;
}

/**
 * @type {import("../index.js").TransformFn<FencedGroup>}
 */
export default function fencedGroup(node, transform) {
  const cols = node.items
    .map((col) => {
      if (col.length === 1) {
        return transform(col[0]);
      }

      return {
        tag: "mrow",
        childNodes: col.map(transform).filter(notNull),
      };
    })
    .reduce(
      (joined, next, i) => {
        joined?.childNodes?.push(next);

        const sep = node.attrs.seps[i];
        if (sep) {
          joined?.childNodes?.push({
            tag: "mo",
            textContent: sep,
            attrs: { separator: "true" },
          });
        }

        return joined;
      },
      {
        tag: "mrow",
        childNodes: [],
      },
    );

  const { open, close } = node.attrs;

  if (cols && !open && !close) {
    return cols;
  }

  const childNodes = [];

  if (open) {
    childNodes.push({
      tag: "mo",
      textContent: open,
      attrs: {
        fence: "true",
      },
    });
  }

  if (cols?.childNodes?.length === 1) {
    childNodes.push(cols.childNodes[0]);
  } else {
    childNodes.push(cols);
  }

  if (node.attrs.close) {
    childNodes.push({
      tag: "mo",
      textContent: node.attrs.close,
      attrs: {
        fence: "true",
      },
    });
  }

  return {
    tag: "mrow",
    childNodes,
  };
}
