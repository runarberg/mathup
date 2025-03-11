import expr from "./expr.js";

/**
 * @typedef {import("../../tokenizer/index.js").Token} Token
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").Term} Term
 * @typedef {import("../index.js").MultiScripts} MultiScripts
 */

/** @returns {Term} */
function empty() {
  return { type: "Term", items: [] };
}

/**
 * @param {Token} token
 * @returns {boolean}
 */
function isIndexBreak(token) {
  if (token.type === "sep.row" || token.type === "sep.col") {
    return true;
  }

  if (token.type !== "infix") {
    return false;
  }

  return token.value === "sub" || token.value === "sup";
}

/**
 * @param {Node[] | null} nodes
 * @returns {Node[]}
 */
function prepareScript(nodes) {
  if (!nodes) {
    return [];
  }

  if (nodes.at(-1)?.type === "SpaceLiteral") {
    // ignore trailing space
    nodes.pop();
  }

  if (nodes.length !== 1) {
    return nodes;
  }

  const [node] = nodes;

  if (node.type !== "FencedGroup" || node.items.length !== 1) {
    return nodes;
  }

  const [cell] = node.items;

  if (cell.length === 1) {
    const [first] = cell;
    const term =
      first.type === "Term" && first.items.length === 1
        ? first.items[0]
        : first;

    if (term.type.endsWith("Literal")) {
      // We fenced a single item for a reason, lets keep them.
      return nodes;
    }
  }
  return [
    {
      type: "Term",
      items: cell,
    },
  ];
}

/**
 * Parse the series of sub- and sup indices of the multiscript. Note
 * we assume the first two tokens have already been checked.
 *
 * @param {import("../parse.js").State} state
 * @returns {{ scripts: [Node[], Node[]][], end: number }}
 */
function parseScripts(state) {
  let i = state.start + 1;
  let token = state.tokens.at(i);

  /** @type {[Node[], Node[]][]} */
  const scripts = [];
  /** @type {Node[] | null} */
  let sub = null;
  /** @type {Node[] | null} */
  let sup = null;

  /**
   * @returns {void}
   */
  function commit() {
    if ((sub && sub.length > 0) || (sup && sup.length > 0)) {
      scripts.push([prepareScript(sub), prepareScript(sup)]);
    }

    sub = null;
    sup = null;
  }

  // Remember previous position to allow repeat positions.
  let position = token?.value ?? "sub";

  while (token && isIndexBreak(token)) {
    if (token.type === "infix") {
      // Update current position
      position = token.value;
    }

    i += 1;
    token = state.tokens[i];

    if (token && token.type === "space") {
      i += 1;
      token = state.tokens[i];
    }

    /** @type {Node[]} */
    const items = [];
    while (token && token.type !== "paren.close" && !isIndexBreak(token)) {
      const next = expr({
        ...state,
        start: i,
        stack: [],
        nestLevel: state.nestLevel + 1,
        stopAt(other) {
          return (
            other.type === "infix" &&
            (other.value === "sub" || other.value === "sup")
          );
        },
      });

      items.push(next.node);
      i = next.end;
      token = state.tokens[i];
    }

    if (position === "sup") {
      if (sup) {
        commit();
      }
      sup = items;
    } else {
      if (sub) {
        commit();
      }
      sub = items;
    }
  }

  if (sub || sup) {
    commit();
  }

  if (token?.type === "paren.close") {
    i += 1;
  }

  return {
    scripts,
    end: i,
  };
}

/**
 * Parse a multiscript. Note that we assume the first two tokens been
 * checked.
 *
 * @param {import("../parse.js").State} state
 * @returns {{ node: MultiScripts, end: number }}
 */
export default function multiscripts(state) {
  let { scripts, end: i } = parseScripts(state);
  let token = state.tokens.at(i);

  /** @type {Node | undefined} */
  let base;
  /** @type {[Node[], Node[]][] | undefined} */
  let prescripts;

  if (!token || token.type === "space") {
    // There is nothing after the already parsed scripts. Apply as postscripts.
    base = state.stack.pop();
    if (base?.type === "SpaceLiteral") {
      base = empty();
    }
  } else {
    // existing scripts are prescripts. See if there are postscripts.
    prescripts = scripts;
    scripts = [];

    const next = expr({
      ...state,
      start: i,
      stack: [],
      nestLevel: state.nestLevel + 1,
      stopAt(other) {
        return other.type === "paren.open";
      },
    });

    base = next.node;
    i = next.end;
    token = state.tokens[i];

    if (token?.type === "paren.open") {
      const nextToken = state.tokens.at(i + 1);

      if (
        nextToken?.type === "infix" &&
        (nextToken.value === "sub" || nextToken.value === "sup")
      ) {
        ({ scripts, end: i } = parseScripts({ ...state, start: i }));
      }
    }
  }

  /** @type {MultiScripts} */
  const node = {
    type: "MultiScripts",
    base: base ?? empty(),
    post: scripts,
  };

  if (prescripts) {
    node.pre = prescripts;
  }

  return {
    node,
    end: i,
  };
}
