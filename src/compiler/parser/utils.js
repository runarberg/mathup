/**
 * @typedef {import("./index.js").Node} Node
 */

/**
 * @param {Node} node
 * @returns {void}
 */
export function addZeroLSpaceToOperator(node) {
  let first = node;
  while (
    first &&
    (first.type === "Term" ||
      first.type === "UnaryOperation" ||
      first.type === "BinaryOperation" ||
      first.type === "TernaryOperation")
  ) {
    [first] = first.items;
  }

  if (!first) {
    return;
  }

  if (first.type === "OperatorLiteral") {
    if (!first.attrs) {
      first.attrs = {};
    }

    if (typeof first.attrs.lspace === "undefined") {
      first.attrs.lspace = 0;
    }
  }
}
