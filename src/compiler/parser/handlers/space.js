/**
 * @typedef {import("../parse.js").State} State
 * @typedef {import("../index.js").SpaceLiteral} SpaceLiteral
 */

/**
 * @param {number} n - Number of space literals
 * @returns {number} - The width in units of ex
 */
function spaceWidth(n) {
  if (n <= 3) {
    return 0.35 * (n - 1);
  }

  if (n <= 5) {
    return 0.5 * (n - 1);
  }

  return n - 3;
}

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
    : { width: `${spaceWidth(length)}ex` };

  return {
    node: {
      type: "SpaceLiteral",
      attrs,
    },
    end: start + 1,
  };
}
