/**
 * @typedef {import("../parse.js").State} State
 * @typedef {import("../index.js").SpaceLiteral} SpaceLiteral
 */

/**
 * @param {number} n - Number of space literals
 * @returns {number} - The width in units of ex
 */
function spaceWidth(n) {
  if (n <= 0) {
    return 0;
  }

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
export default function space(state) {
  const token = state.tokens[state.start];
  const lineBreak = token.value.startsWith("\n");

  const width = lineBreak ? 0 : token.value.length;

  return {
    node: {
      type: "SpaceLiteral",
      attrs: { width: `${spaceWidth(width)}ex` },
    },
    end: state.start + 1,
  };
}
