import expr from "./handlers/expr.js";

/**
 * @typedef {import("../tokenizer/index.js").Token} Token
 * @typedef {import("./index.js").Node} Node
 * @typedef {import("./index.js").Sentence} Sentence
 *
 * @typedef {object} State
 * @property {Token[]} tokens
 * @property {number} start
 * @property {Node[]} stack
 * @property {number} nestLevel
 * @property {(token: Token) => boolean} [stopAt]
 * @property {string[]} [textTransforms]
 *
 * @param {Token[]} tokens
 * @returns {Sentence}
 */
export default function parse(tokens) {
  const body = [];
  let pos = 0;

  while (pos < tokens.length) {
    const state = {
      tokens,
      start: pos,
      stack: body,
      nestLevel: 1,
    };

    const next = expr(state);

    pos = next.end;
    body.push(next.node);
  }

  return {
    type: "Sentence",
    body,
  };
}
