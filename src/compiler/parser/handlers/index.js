import command from "./command.js";
import group from "./group.js";
import infix from "./infix.js";
import prefix from "./prefix.js";
import space from "./space.js";

/**
 * @typedef {import("../../tokenizer/index.js").TokenType} TokenType
 * @typedef {import("../parse.js").State} State
 * @typedef {import("../index.js").Node} Node
 * @typedef {(state: State) => { node: Node, end: number }} Handler
 * @typedef {"Ident" | "Number" | "Operator" | "Text"} LiteralType
 */

/**
 * @param {LiteralType} type
 * @returns {Handler}
 */
const literal =
  (type) =>
  ({ start, tokens }) => {
    const { value, attrs } = tokens[start];

    return {
      node: {
        type: `${type}Literal`,
        value,
        attrs,
      },
      end: start + 1,
    };
  };

/** @type {[TokenType, Handler][]} */
const handlers = [
  ["command", command],
  ["ident", literal("Ident")],
  ["number", literal("Number")],
  ["operator", literal("Operator")],
  ["text", literal("Text")],
  ["infix", infix],
  ["paren.open", group],
  ["prefix", prefix],
  ["space", space],
];

export default new Map(handlers);
