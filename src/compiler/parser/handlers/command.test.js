import test from "ava";

import { SPACE, STATE, ident, op, term } from "./__test__/utils.js";
import command from "./command.js";

test("no opperant", (t) => {
  const tokens = [{ type: "command", name: "foo" }];
  const { end, node } = command({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "command");
  t.deepEqual(node.items, [term()]);
});

test("unknown command", (t) => {
  const tokens = [
    { type: "command", name: "unknown" },
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "command");
  t.deepEqual(node.items, [term(ident("A"))]);
});

test("single text-transform", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(
    node,
    term({
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf"],
      items: [ident("A")],
    }),
  );
});

test("double text-transform", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "command", name: "text-transform", value: "it" },
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(
    node,
    term({
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf", "it"],
      items: [ident("A")],
    }),
  );
});

test("double text-transform with spaces", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    SPACE,
    { type: "command", name: "text-transform", value: "it" },
    SPACE,
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(
    node,
    term({
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf", "it"],
      items: [ident("A")],
    }),
  );
});

test("text-transform with following term", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(
    node,
    term(
      {
        type: "UnaryOperation",
        name: "command",
        transforms: ["bf"],
        items: [ident("A")],
      },
      ident("b"),
    ),
  );
});

test("multiple text-transform with following term", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "command", name: "text-transform", value: "it" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(
    node,
    term(
      {
        type: "UnaryOperation",
        name: "command",
        transforms: ["bf", "it"],
        items: [ident("A")],
      },
      ident("b"),
    ),
  );
});

test("text and style command with following term", (t) => {
  const tokens = [
    { type: "command", name: "color", value: "red" },
    { type: "command", name: "text-transform", value: "bf" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
  ];

  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(node, {
    type: "UnaryOperation",
    name: "command",
    styles: new Map([["color", "red"]]),
    items: [
      term(
        {
          type: "UnaryOperation",
          name: "command",
          transforms: ["bf"],
          items: [ident("A")],
        },
        ident("b"),
      ),
    ],
  });
});

test("text-transform on a group", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "command");
  t.deepEqual(node.transforms, ["bf"]);
  t.is(node.items.length, 1);
});

test("command on a group followed by ident", (t) => {
  const tokens = [
    { type: "command", name: "unknown" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
    { type: "ident", value: "c" },
  ];
  const { end, node } = command({ ...STATE, tokens });

  t.is(end, 5);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "command");
  t.is(node.items.length, 1);
});

test("command won’t parse through a likely closing pipe", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "command", name: "unknown" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
  ];

  const { end, node } = command({
    ...STATE,
    start: 1,
    stack: [op("|")],
    tokens,
  });

  t.is(end, 4);
  t.deepEqual(node, {
    type: "UnaryOperation",
    name: "command",
    styles: new Map(),
    items: [term(ident("a"))],
  });
});

test("command won’t parse through a likely closing double pipe", (t) => {
  const tokens = [
    { type: "operator", value: "∥" },
    { type: "command", name: "unknown" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "∥" },
  ];
  const { end, node } = command({
    ...STATE,
    start: 1,
    stack: [op("∥")],
    tokens,
  });

  t.is(end, 4);
  t.deepEqual(node, {
    type: "UnaryOperation",
    name: "command",
    styles: new Map(),
    items: [term(ident("a"))],
  });
});

test("stacked commands won’t parse through a likely closing pipe", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "command", name: "one" },
    SPACE,
    { type: "command", name: "two" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
  ];
  const { end, node } = command({
    ...STATE,
    start: 1,
    stack: [op("|")],
    tokens,
  });

  t.is(end, 6);
  t.deepEqual(node, {
    type: "UnaryOperation",
    name: "command",
    styles: new Map(),
    items: [term(ident("a"))],
  });
});

test("don‘t confuse an open pipe identifier with an operator", (t) => {
  const tokens = [
    { type: "identifier", value: "|" },
    { type: "command", name: "unknown" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
  ];

  const { end, node } = command({
    ...STATE,
    start: 1,
    stack: [ident("|")],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, {
    type: "UnaryOperation",
    name: "command",
    styles: new Map(),
    items: [term(ident("a"), op("|"))],
  });
});
