import { addZeroLSpaceToOperator } from "../utils.js";

import expr from "./expr.js";
import multiscripts from "./multiscripts.js";

/**
 * @typedef {import("../../tokenizer/index.js").Token} Token
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").FencedGroup} FencedGroup
 * @typedef {import("../index.js").MatrixGroup} MatrixGroup
 * @typedef {import("../index.js").MultiScripts} MultiScripts
 * @typedef {import("../index.js").LiteralAttrs} LiteralAttrs
 */

/**
 * @param {Token} token
 * @returns {Omit<Token, "type">}
 */
function omitType(token) {
  const { type: _type, ...rest } = token;

  return rest;
}

/**
 * @param {import("../parse.js").State} state
 * @returns {{ node: FencedGroup | MatrixGroup | MultiScripts, end: number }}
 */
export default function group(state) {
  let i = state.start;
  let token = state.tokens[i];

  const open = token;

  /** @type {{ value: string, attrs?: LiteralAttrs }[]} */
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

  if (
    token &&
    token.type === "infix" &&
    (token.value === "sub" || token.value === "sup")
  ) {
    return multiscripts({ ...state, start: i - 1 });
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
      /** @type {{ value: string, attrs?: LiteralAttrs }} */
      const sepToken = { value: token.value };
      if (token.attrs) {
        sepToken.attrs = token.attrs;
      }

      seps.push(sepToken);
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
    open: omitType(open),
    close: close ? omitType(close) : null,
    seps,
  };

  if (attrs.close?.value === "|" && !open.value) {
    // Add a small space before the "evaluate at" operator
    if (!attrs.close.attrs) {
      attrs.close.attrs = {};
    }
    attrs.close.attrs.lspace = "0.35ex";
  }

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
