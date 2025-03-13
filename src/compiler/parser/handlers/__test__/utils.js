/**
 * @typedef {import("../index.js").Node} Node
 */

export const STATE = Object.freeze({ start: 0, tokens: [], stack: [] });

export const PAREN_OPEN = { type: "paren.open", value: "(" };
export const PAREN_CLOSE = { type: "paren.close", value: ")" };
export const SUB = { type: "infix", value: "sub" };
export const SUP = { type: "infix", value: "sup" };
export const COL_SEP = { type: "sep.col", value: "," };
export const ROW_SEP = { type: "sep.row", value: ";" };
export const SPACE = { type: "space", value: " " };

/**
 * @param {import("../index.js").Node[]} items
 * @returns {import("../../index.js").Term}
 */
export function term(...items) {
  return {
    type: "Term",
    items,
  };
}

/**
 * @param {string} value
 * @returns {import("../../index.js").IdentLiteral}
 */
export function ident(value) {
  return {
    type: "IdentLiteral",
    value,
  };
}

/**
 * @param {string} value
 * @returns {import("../../index.js").OperatorLiteral}
 */
export function op(value) {
  return {
    type: "OperatorLiteral",
    value,
  };
}

/**
 * @param {number} [width]
 * @returns {import("../../index.js").SpaceLiteral}
 */
export function space(width = 0) {
  return {
    type: "SpaceLiteral",
    attrs: { width: `${width}ex` },
  };
}

/**
 * @param {string} name
 * @param {Node} item
 * @returns {import("../../index.js").UnaryOperation}
 */
export function unary(name, item) {
  return {
    type: "UnaryOperation",
    name,
    items: [item],
  };
}

/**
 * @param {string} name
 * @param {[Node, Node]} items
 * @returns {import("../../index.js").BinaryOperation}
 */
export function binary(name, items) {
  return {
    type: "BinaryOperation",
    name,
    items,
  };
}
