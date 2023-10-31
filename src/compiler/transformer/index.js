import transforms from "./transforms/index.js";

/**
 * @typedef {import("../parser/index.js").Node} ASTNode
 *
 * @typedef {object} TransformerOptions
 * @property {"ltr" | "rtl" | null} [dir=null] - The reading direction of the output.
 * @property {"block" | "inline" | null} [display=null] - Whether the expression should be in display mode.
 *
 * @typedef {object} Tag
 * @property {string} tag
 * @property {Record<string, string | number | boolean | undefined | null>} [attrs]
 * @property {(Tag | null)[]} [childNodes]
 * @property {string} [textContent]
 */

/**
 * @template {ASTNode} [Node=ASTNode]
 * @typedef {(node: Node, transform: (node: ASTNode) => (Tag | null), options: Required<TransformerOptions>) => (Tag | null)} TransformFn
 */

/**
 * @param {Required<TransformerOptions>} options
 * @returns {(node: ASTNode) => (Tag | null)}
 */
export default function transformer(options) {
  return function transform(node) {
    const transformNode = transforms.get(node.type);

    if (!transformNode) {
      return null;
    }

    return transformNode(node, transform, options);
  };
}
