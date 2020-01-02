import group from "./group.mjs";
import infix from "./infix.mjs";
import prefix from "./prefix.mjs";
import space from "./space.mjs";
import term from "./term.mjs";

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
