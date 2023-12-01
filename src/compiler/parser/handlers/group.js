import { addZeroLSpaceToOperator } from "../utils.js";

import expr from "./expr.js";

/**
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").FencedGroup} FencedGroup
 * @typedef {import("../index.js").MatrixGroup} MatrixGroup
 */

/**
 * @param {import("../parse.js").State} state
 * @returns {{ node: FencedGroup | MatrixGroup, end: number }}
 */
export default function group(state) {
  let i = state.start;
  let token = state.tokens[i];

  const open = token;

  /** @type {string[]} */
  const seps = [];

  /** @type {Node[]} */
  let cell = [];

  /** @type {Node[][]} */
  let cols = [];

  /** @type {Node[][][]} */
  const rows = [];

  i += 1;
  token = state.tokens[i];

  if (token && token.type === "space") {
    // Ignore leading space.
    i += 1;
    token = state.tokens[i];
  }

  while (token && token.type !== "paren.close") {
    if (token.type === "space" && token.value === " ") {
      // No need to add tokens which don’t render elements to our
      // cell.
      i += 1;
      token = state.tokens[i];

      continue;
    }

    if (token.type === "sep.col") {
      seps.push(token.value);
      cols.push(cell);
      cell = [];
      i += 1;
      token = state.tokens[i];

      // Ignore leading space.
      if (token && token.type === "space") {
        i += 1;
        token = state.tokens[i];
      }

      continue;
    }

    if (token.type === "sep.row") {
      cols.push(cell);
      rows.push(cols);
      cell = [];
      cols = [];
      i += 1;
      token = state.tokens[i];

      // Ignore leading space.
      if (token && token.type === "space") {
        i += 1;
        token = state.tokens[i];
      }

      continue;
    }

    if (cell.length === 1) {
      // If first element is an operator it may throw alignment out
      // with its implicit lspace.
      addZeroLSpaceToOperator(cell[0]);
    }

    const next = expr({
      ...state,
      start: i,
      stack: cell,
      nestLevel: state.nestLevel + 1,
    });

    cell.push(next.node);
    i = next.end;
    token = state.tokens[i];
  }

  if (cell.length > 0) {
    cols.push(cell);
  }

  const end = i + 1;
  const close = token && token.type === "paren.close" ? token : null;

  const attrs = {
    open: open.value,
    close: (close && token.value) || "",
    seps,
  };

  if (rows.length === 0) {
    return {
      node: { type: "FencedGroup", items: cols, attrs },
      end,
    };
  }

  const rowItems = rows;

  if (cols.length > 0) {
    rowItems.push(cols);
  }

  return {
    node: { type: "MatrixGroup", items: rowItems, attrs },
    end,
  };
}
