import group from "./group.js";
import infix from "./infix.js";
import prefix from "./prefix.js";
import space from "./space.js";
import term from "./term.js";

/**
 * @typedef {import("../index.js").Node} Node
 */

/**
 * @param {import("../parse.js").State} state
 * @returns {{ node: Node, end: number }}
 */
export default function expr(state) {
  if (state.start >= state.tokens.length) {
    return {
      node: {
        type: "Term",
        items: [],
      },

      end: state.start,
    };
  }

  const { type } = state.tokens[state.start];

  if (type === "paren.open") {
    return group(state);
  }

  if (type === "space") {
    return space(state);
  }

  if (type === "infix") {
    return infix(state);
  }

  if (type === "prefix") {
    return prefix(state);
  }

  return term(state);
}
