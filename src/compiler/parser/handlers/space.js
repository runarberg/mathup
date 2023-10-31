/**
 * @typedef {import("../parse.js").State} State
 * @typedef {import("../index.js").SpaceLiteral} SpaceLiteral
 */
/**
 * @param {State} state
 * @returns {{ node: SpaceLiteral, end: number }}
 */
export default function space({ start, tokens }) {
  const token = tokens[start];
  const blockSpace = token.value.startsWith("\n");

  const { length } = token.value;
  const attrs = blockSpace
    ? { depth: `${length}em` }
    : { width: `${length - 1}ex` };

  return {
    node: {
      type: "SpaceLiteral",
      attrs,
    },
    end: start + 1,
  };
}
