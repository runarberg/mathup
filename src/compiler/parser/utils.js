/**
 * @typedef {import("../tokenizer/index.js").Token} Token
 * @typedef {import("./index.js").Node} Node
 */

/**
 * @param {Token} token
 * @returns {boolean}
 */
export function isPipeOperator(token) {
  return token.type === "operator" && token.value === "|";
}

/**
 * @param {Token} token
 * @returns {boolean}
 */
export function isDoublePipeOperator(token) {
  return token.type === "operator" && token.value === "∥";
}

/**
 * Double pipe defaults to the parallel-to character which is behaves
 * wrong when used as a fence.
 * @param {Node[]} items
 * @returns {void}
 */
export function maybeFixDoublePipe(items) {
  if (items.length < 2) {
    return;
  }

  const first = items.at(0);
  if (first?.type === "OperatorLiteral" && first.value === "∥") {
    first.value = "‖";
  }

  const last = items.at(-1);
  if (last?.type === "OperatorLiteral" && last.value === "∥") {
    last.value = "‖";
  }
}

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
