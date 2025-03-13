import test from "ava";

import term from "./term.js";

const SPACE = { type: "space", value: " " };

test("empty term", (t) => {
  const tokens = [];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, 0);
  t.deepEqual(node, {
    type: "Term",
    items: [],
  });
});

test("singleton term", (t) => {
  const tokens = [{ type: "ident", value: "a" }];
  const { end, node } = term({ start: 0, tokens });

  t.is(end, 1);
  t.deepEqual(node, {
    type: "Term",
    items: [{ type: "IdentLiteral", value: "a" }],
  });
});

test("parses until it finds a space", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "operator", value: "+" },
    { type: "ident", value: "b" },
    SPACE,
    { type: "operator", value: "-" },
    SPACE,
    { type: "number", value: "2" },
    { type: "ident", value: "c" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, 3);
  t.deepEqual(node.items, [
    { type: "IdentLiteral", value: "a" },
    { type: "OperatorLiteral", value: "+" },
    { type: "IdentLiteral", value: "b" },
  ]);
});

test("parses until a parent handler asks it to stop", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sub" },
    { type: "ident", value: "b" },
  ];

  const { end, node } = term({
    start: 0,
    tokens,
    stopAt: ({ type }) => type === "infix",
  });

  t.is(end, 1);
  t.deepEqual(node.items, [{ type: "IdentLiteral", value: "a" }]);

  t.is(term({ start: 0, tokens }).end, 3);
});

test("parses a likely differential as an operator", (t) => {
  const tokens = [
    { type: "ident", value: "d" },
    { type: "ident", value: "x" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, 2);
  t.deepEqual(node, {
    type: "Term",
    items: [
      { type: "OperatorLiteral", value: "𝑑", attrs: { rspace: "0" } },
      { type: "IdentLiteral", value: "x" },
    ],
  });
});

test("d is not likely a differential operator the operant isn’t an ident", (t) => {
  const tokens = [
    { type: "ident", value: "d" },
    { type: "operator", value: "x" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, 2);
  t.deepEqual(node, {
    type: "Term",
    items: [
      { type: "IdentLiteral", value: "d" },
      { type: "OperatorLiteral", value: "x" },
    ],
  });
});

test("parses a likely differential as an operator on a nested ident", (t) => {
  const tokens = [
    { type: "ident", value: "d" },
    { type: "ident", value: "x" },
    { type: "infix", name: "sup" },
    { type: "number", value: "2" },
  ];

  const { end, node } = term({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.is(node.items.length, 2);
  t.deepEqual(node.items[0], {
    type: "OperatorLiteral",
    value: "𝑑",
    attrs: { rspace: "0" },
  });
  t.is(node.items[1].type, "BinaryOperation");
});
