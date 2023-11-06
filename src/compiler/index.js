import { parse } from "./parser/index.js";
import { toDOM, toString, updateDOM } from "./renders/index.js";
import tokenizer from "./tokenizer/index.js";
import transformer from "./transformer/index.js";

/**
 * @typedef {import("./tokenizer/index.js").TokenizerOptions} TokenizerOptions
 * @typedef {import("./transformer/index.js").TransformerOptions} TransformerOptions
 * @typedef {import("./renders/index.js").RenderOptions} RenderOptions
 * @typedef {TokenizerOptions & TransformerOptions & RenderOptions} Options
 *
 * @typedef {object} Result
 * @property {() => string} toString
 * @property {() => Element | DocumentFragment} toDOM
 * @property {(root: Element) => void} updateDOM
 *
 * @param {Options} options
 * @returns {(input: string) => Result}
 */
export default function compiler({
  bare = false,
  dir = null,
  display = null,

  decimalMark = ".",
  colSep = decimalMark === "," ? ";" : ",",
  rowSep = colSep === ";" ? ";;" : ";",
}) {
  const tokenizerOptions = { decimalMark, colSep, rowSep };
  const transformerOptions = { dir, display };
  const renderOptions = { bare };

  /**
   * @param {string} input - Mathup expression
   * @returns {Result}
   */
  return function compile(input) {
    const tokenize = tokenizer(tokenizerOptions);
    const tokens = tokenize(input);
    const ast = parse([...tokens]);
    const transform = transformer(transformerOptions);
    const domTree = transform(ast);

    if (!domTree) {
      throw new Error("Failed parsing AST");
    }

    return {
      toDOM() {
        return toDOM(domTree, renderOptions);
      },

      toString() {
        return toString(domTree, renderOptions);
      },

      updateDOM(root) {
        return updateDOM(root, domTree, renderOptions);
      },
    };
  };
}
