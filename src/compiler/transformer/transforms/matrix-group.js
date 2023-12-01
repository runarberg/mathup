/**
 * @typedef {import("../../parser/index.js").Node} Node
 * @typedef {import("../../parser/index.js").MatrixGroup} MatrixGroup
 * @typedef {import("../index.js").Tag} Tag
 */

/**
 * @param {Tag | null} tag
 * @returns {boolean}
 */
function notNull(tag) {
  return tag !== null;
}

/** @type {import("../index.js").TransformFn<MatrixGroup>} */
export default function matrixGroup(node, transform) {
  const childNodes = [];

  const colCount = node.items.reduce(
    (max, row) => Math.max(max, row.length),
    0,
  );

  // auto start-align tables with no close param.
  const aligns = !node.attrs.close
    ? Array.from({ length: colCount }).fill("start")
    : [];

  if (node.attrs.open) {
    childNodes.push({
      tag: "mo",
      textContent: node.attrs.open,
      attrs: {
        fence: "true",
      },
    });
  }

  childNodes.push({
    tag: "mtable",
    childNodes: node.items.map((row) => ({
      tag: "mtr",
      childNodes: row.map((col, i) => ({
        tag: "mtd",
        attrs: aligns[i] ? { style: `text-align: ${aligns[i]}` } : {},
        childNodes: col.map(transform).filter(notNull),
      })),
    })),
  });

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
