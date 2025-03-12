/**
 * @typedef {Record<string, string | boolean | number | null | undefined>} LiteralAttrs
 */

/**
 * @typedef {object} GroupAttrs
 * @property {{ value: string, attrs?: LiteralAttrs }} open
 * @property {{ value: string, attrs?: LiteralAttrs } | null} close
 * @property {{ value: string, attrs?: LiteralAttrs }[]} seps
 */

/**
 * @typedef {object} Sentence
 * @property {"Sentence"} type
 * @property {Node[]} body
 */

/**
 * @typedef {object} Term
 * @property {"Term"} type
 * @property {Map<string, string>} [styles]
 * @property {Node[]} items
 */

/**
 * @typedef {object} FencedGroup
 * @property {"FencedGroup"} type
 * @property {Node[][]} items
 * @property {GroupAttrs} attrs
 */

/**
 * @typedef {object} MultiScripts
 * @property {"MultiScripts"} type
 * @property {Node} base
 * @property {[Node[], Node[]][]} post
 * @property {[Node[], Node[]][]} [pre]
 */

/**
 * @typedef {object} MatrixGroup
 * @property {"MatrixGroup"} type
 * @property {Node[][][]} items
 * @property {GroupAttrs} attrs
 */

/**
 * @typedef {object} UnaryOperation
 * @property {"UnaryOperation"} type
 * @property {string} name
 * @property {string} [accent]
 * @property {string[]} [transforms]
 * @property {Map<string, string>} [styles]
 * @property {LiteralAttrs} [attrs]
 * @property {[Node]} items
 */

/**
 * @typedef {object} BinaryOperation
 * @property {"BinaryOperation"} type
 * @property {string} name
 * @property {LiteralAttrs} [attrs]
 * @property {[Node, Node]} items
 */

/**
 * @typedef {object} TernaryOperation
 * @property {"TernaryOperation"} type
 * @property {string} name
 * @property {LiteralAttrs} [attrs]
 * @property {[Node, Node, Node]} items
 */

/**
 * @typedef {object} IdentLiteral
 * @property {"IdentLiteral"} type
 * @property {string} value
 * @property {LiteralAttrs} [attrs]
 */

/**
 * @typedef {object} NumberLiteral
 * @property {"NumberLiteral"} type
 * @property {string} value
 * @property {LiteralAttrs} [attrs]
 */

/**
 * @typedef {object} OperatorLiteral
 * @property {"OperatorLiteral"} type
 * @property {string} value
 * @property {LiteralAttrs} [attrs]
 */

/**
 * @typedef {object} SpaceLiteral
 * @property {"SpaceLiteral"} type
 * @property {{ width: string }} attrs
 */

/**
 * @typedef {object} TextLiteral
 * @property {"TextLiteral"} type
 * @property {string} value
 * @property {LiteralAttrs} [attrs]
 */

/**
 * @typedef {IdentLiteral
 *   | NumberLiteral
 *   | OperatorLiteral
 *   | SpaceLiteral
 *   | TextLiteral} Literal
 */

/**
 * @typedef {Sentence
 *   | Term
 *   | FencedGroup
 *   | MatrixGroup
 *   | UnaryOperation
 *   | BinaryOperation
 *   | TernaryOperation
 *   | MultiScripts
 *   | Literal} Node
 */

export { default as parse } from "./parse.js";
