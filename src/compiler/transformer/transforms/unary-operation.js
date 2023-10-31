/**
 * @typedef {import("../../parser/index.js").Node} ASTNode
 * @typedef {import("../../parser/index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../../parser/index.js").Literal} Literal
 * @typedef {import("../../parser/index.js").SpaceLiteral} SpaceLiteral
 */

/**
 * @param {ASTNode} node
 * @returns {node is Exclude<Literal, SpaceLiteral>}
 */
function canApplyVariant(node) {
  return (
    node.type === "IdentLiteral" ||
    node.type === "NumberLiteral" ||
    node.type === "OperatorLiteral" ||
    node.type === "TextLiteral"
  );
}

/**
 * @template {ASTNode} Node
 *
 * @overload
 * @param {Node} childNode
 * @param {UnaryOperation} node
 * @returns {Node}
 *
 * @overload
 * @param {Node[]} childNode
 * @param {UnaryOperation} node
 * @returns {Node[]}
 *
 * @overload
 * @param {Node[][]} childNode
 * @param {UnaryOperation} node
 * @returns {Node[][]}
 *
 * @param {Node | Node[] | Node[][]} childNode
 * @param {UnaryOperation} node
 */
function addStyleAttrs(childNode, node) {
  if (Array.isArray(childNode)) {
    return childNode.map((grandChild) =>
      addStyleAttrs(/** @type {Node} */ (grandChild), node),
    );
  }

  if (canApplyVariant(childNode)) {
    return {
      ...childNode,
      attrs: {
        ...(childNode.attrs || {}),
        ...node.attrs,
      },
    };
  }

  if ("items" in childNode) {
    return {
      ...childNode,
      items: childNode.items.map((grandChild) =>
        addStyleAttrs(/** @type {Node} */ (grandChild), node),
      ),
    };
  }

  return childNode;
}

/**
 * @type {import("../index.js").TransformFn<UnaryOperation>}
 */
export default function unaryOperation(node, transform) {
  if (node.name === "fence") {
    const { open, close } = node.attrs || {};

    /** @type {(import("../index.js").Tag | null)[]} */
    const childNodes = [
      { tag: "mo", attrs: { fence: true }, textContent: `${open}` },
      node.items.length === 1
        ? transform(node.items[0])
        : { tag: "mrow", childNodes: node.items.map(transform) },
      { tag: "mo", attrs: { fence: true }, textContent: `${close}` },
    ];

    return {
      tag: "mrow",
      childNodes,
    };
  }

  if (node.name === "style" && node.items.length === 1) {
    return transform(addStyleAttrs(node.items[0], node));
  }

  const tag = `m${node.name}`;

  const childNodes =
    node.items.length === 1
      ? [transform(node.items[0])]
      : [{ tag: "mrow", childNodes: node.items.map(transform) }];

  if (node.accent) {
    childNodes.push({
      tag: "mo",
      textContent: node.accent,
      attrs: { accent: true },
    });
  }

  return {
    tag,
    childNodes,
    attrs: node.attrs,
  };
}
