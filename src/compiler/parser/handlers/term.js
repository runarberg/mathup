import handlers from "./index.js";

/**
 * @typedef {import("../parse.js").State} State
 * @typedef {import("../index.js").Term} Term
 */

const KEEP_GOING_TYPES = [
  "command",
  "ident",
  "infix",
  "number",
  "operator",
  "paren.open",
  "prefix",
  "text",
];

/**
 * @param {State} state
 * @returns {{ node: Term; end: number }}
 */
export default function term({ start, tokens }) {
  let i = start;
  let token = tokens[i];
  const items = [];

  while (token && KEEP_GOING_TYPES.includes(token.type)) {
    const handler = handlers.get(token.type);

    if (!handler) {
      throw new Error("Unknown Hander");
    }

    const next = handler({ start: i, stack: items, tokens });

    items.push(next.node);

    i = next.end;
    token = tokens[i];
  }

  return {
    node: {
      type: "Term",
      items,
    },
    end: i,
  };
}
