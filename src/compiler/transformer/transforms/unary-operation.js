import {
  literalValue,
  textLiteralAttrs,
  textLiteralValue,
} from "./text-transforms.js";

/**
 * @typedef {import("../../parser/index.js").Node} ASTNode
 * @typedef {import("../../parser/index.js").UnaryOperation} UnaryOperation
 * @typedef {import("../../parser/index.js").Literal} Literal
 * @typedef {import("../../parser/index.js").SpaceLiteral} SpaceLiteral
 */

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
function handleCommand(childNode, node) {
  if (Array.isArray(childNode)) {
    return childNode.map((grandChild) =>
      handleCommand(/** @type {Node} */ (grandChild), node),
    );
  }

  if (childNode.type === "TextLiteral") {
    const { attrs = {}, transforms = [] } = node;

    return {
      ...childNode,
      attrs: textLiteralAttrs(attrs, transforms),
      value: textLiteralValue(childNode.value, transforms),
    };
  }

  if (
    childNode.type === "IdentLiteral" &&
    childNode.value.length === 1 &&
    node.transforms &&
    node.transforms.length === 1 &&
    node.transforms[0] === "normal"
  ) {
    // Disable auto-italic idents
    return {
      ...childNode,
      attrs: {
        ...(childNode.attrs ?? {}),
        mathvariant: "normal",
      },
    };
  }

  if (
    childNode.type === "IdentLiteral" ||
    childNode.type === "NumberLiteral" ||
    childNode.type === "OperatorLiteral"
  ) {
    const { transforms = [] } = node;

    return {
      ...childNode,
      value: literalValue(childNode.value, transforms),
    };
  }

  if ("items" in childNode) {
    return {
      ...childNode,
      items: childNode.items.map((grandChild) =>
        handleCommand(/** @type {Node} */ (grandChild), node),
      ),
    };
  }

  return childNode;
}

/**
 * @type {import("../index.js").TransformFn<UnaryOperation>}
 */
export default function unaryOperation(node, transform) {
  if (node.name === "command") {
    return transform(handleCommand(node.items[0], node));
  }

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
