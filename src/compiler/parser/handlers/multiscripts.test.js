import test from "ava";

import multiscripts from "./multiscripts.js";

const PAREN_OPEN = { type: "paren.open", value: "(" };
const PAREN_CLOSE = { type: "paren.close", value: ")" };
const SUB = { type: "infix", value: "sub" };
const SUP = { type: "infix", value: "sup" };
const COL_SEP = { type: "sep.col", value: "," };
const ROW_SEP = { type: "sep.row", value: ";" };
const SPACE = { type: "space", value: " " };

/**
 * @param {import("./index.js").Node[]} [items]
 * @returns {import("../index.js").Term}
 */
function term(...items) {
  return {
    type: "Term",
    items,
  };
}

/**
 * @param {string} value
 * @returns {import("../index.js").IdentLiteral}
 */
function ident(value) {
  return {
    type: "IdentLiteral",
    value,
  };
}

/**
 * @param {string} value
 * @returns {import("../index.js").OperatorLiteral}
 */
function op(value) {
  return {
    type: "OperatorLiteral",
    value,
  };
}

/**
 * @param {number} [width]
 * @returns {import("../index.js").SpaceLiteral}
 */
function space(width = 0) {
  return {
    type: "SpaceLiteral",
    attrs: { width: `${width}ex` },
  };
}

test("empty multiscripts sub first", (t) => {
  const tokens = [PAREN_OPEN, SUB, PAREN_CLOSE];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, 3);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [],
  });
});

test("empty multiscripts sup first", (t) => {
  const tokens = [PAREN_OPEN, SUP, PAREN_CLOSE];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, 3);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [],
  });
});

test("a single subscript", (t) => {
  const tokens = [PAREN_OPEN, SUB, { type: "ident", value: "a" }, PAREN_CLOSE];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [[[term(ident("a"))], []]],
  });
});

test("a single supscript", (t) => {
  const tokens = [PAREN_OPEN, SUP, { type: "ident", value: "a" }, PAREN_CLOSE];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [[[], [term(ident("a"))]]],
  });
});

test("space as base is converted to empty term", (t) => {
  const tokens = [
    SPACE,
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "a" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({
    start: 1,
    tokens,
    stack: [space()],
  });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [[[], [term(ident("a"))]]],
  });
});

test("postscripts with a base", (t) => {
  const tokens = [
    { type: "ident", value: "A" },
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "a" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({
    start: 1,
    tokens,
    stack: [term(ident("A"))],
  });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(ident("A")),
    post: [[[], [term(ident("a"))]]],
  });
});

test("prescripts with a base", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    PAREN_CLOSE,
    { type: "ident", value: "A" },
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(ident("A")),
    post: [],
    pre: [[[term(ident("a"))], []]],
  });
});

test("pre- and postscripts with a base", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    PAREN_CLOSE,
    { type: "ident", value: "A" },
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "b" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(ident("A")),
    post: [[[], [term(ident("b"))]]],
    pre: [[[term(ident("a"))], []]],
  });
});

test("space before base prevents prescripts", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    PAREN_CLOSE,
    SPACE,
    { type: "ident", value: "A" },
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "b" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, 4);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [[[term(ident("a"))], []]],
  });
});

test("space after base prevents postscripts", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    PAREN_CLOSE,
    { type: "ident", value: "A" },
    SPACE,
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "b" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, 5);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(ident("A")),
    post: [],
    pre: [[[term(ident("a"))], []]],
  });
});

test("multiple terms as a single index", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    SPACE,
    { type: "operator", value: "+" },
    SPACE,
    { type: "ident", value: "b" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [
        [term(ident("a")), space(), term(op("+")), space(), term(ident("b"))],
        [],
      ],
    ],
  });
});

test("sub and sup indecies on same column", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    SUP,
    { type: "ident", value: "b" },
    SUB,
    { type: "ident", value: "c" },
    SUP,
    { type: "ident", value: "d" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [[term(ident("a"))], [term(ident("b"))]],
      [[term(ident("c"))], [term(ident("d"))]],
    ],
  });
});

test("comma seperated sup indecies", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "a" },
    COL_SEP,
    { type: "ident", value: "b" },
    COL_SEP,
    { type: "ident", value: "c" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [[], [term(ident("a"))]],
      [[], [term(ident("b"))]],
      [[], [term(ident("c"))]],
    ],
  });
});

test("comma seperated sub indecies", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    COL_SEP,
    { type: "ident", value: "b" },
    COL_SEP,
    { type: "ident", value: "c" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [[term(ident("a"))], []],
      [[term(ident("b"))], []],
      [[term(ident("c"))], []],
    ],
  });
});

test("semicolon seperated indecies", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "a" },
    ROW_SEP,
    { type: "ident", value: "b" },
    ROW_SEP,
    { type: "ident", value: "c" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [[], [term(ident("a"))]],
      [[], [term(ident("b"))]],
      [[], [term(ident("c"))]],
    ],
  });
});

test("multiple sup indecies", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUP,
    { type: "ident", value: "a" },
    SUP,
    { type: "ident", value: "b" },
    SUP,
    { type: "ident", value: "c" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [[], [term(ident("a"))]],
      [[], [term(ident("b"))]],
      [[], [term(ident("c"))]],
    ],
  });
});

test("comma after a full index column", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    SUP,
    { type: "ident", value: "b" },
    COL_SEP,
    { type: "ident", value: "c" },
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [[term(ident("a"))], [term(ident("b"))]],
      [[], [term(ident("c"))]],
    ],
  });
});

test("space around sub/sup is ignored", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    SPACE,
    { type: "ident", value: "a" },
    SPACE,
    SUP,
    SPACE,
    { type: "ident", value: "b" },
    SPACE,
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [[[term(ident("a"))], [term(ident("b"))]]],
  });
});

test("space around comma is ignored", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    SPACE,
    { type: "ident", value: "a" },
    SPACE,
    COL_SEP,
    SPACE,
    { type: "ident", value: "b" },
    SPACE,
    PAREN_CLOSE,
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [
      [[term(ident("a"))], []],
      [[term(ident("b"))], []],
    ],
  });
});

test("closing paren is optional", (t) => {
  const tokens = [
    PAREN_OPEN,
    SUB,
    { type: "ident", value: "a" },
    SUP,
    { type: "ident", value: "b" },
  ];

  const { end, node } = multiscripts({ start: 0, tokens, stack: [] });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "MultiScripts",
    base: term(),
    post: [[[term(ident("a"))], [term(ident("b"))]]],
  });
});
