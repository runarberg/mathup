import test from "ava";

import {
  SPACE,
  STATE,
  binary,
  ident,
  op,
  term,
  unary,
} from "./__test__/utils.js";
import prefix from "./prefix.js";

/** @typedef {import("../../tokenizer/index.js").Token} Token */

test("empty unary", (t) => {
  const tokens = [{ type: "prefix", name: "foo" }];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= 1);
  t.deepEqual(node, unary("foo", term()));
});

test("empty binary", (t) => {
  /** @type {Token[]} */
  const tokens = [{ type: "prefix", name: "foo", arity: 2 }];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= 1);
  t.deepEqual(node, binary("foo", [term(), term()]));
});

test("single term unary", (t) => {
  /** @type {Token[]} */
  const tokens = [
    { type: "prefix", name: "foo" },
    { type: "ident", value: "a" },
    SPACE,
    { type: "ident", value: "wont reach" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 2);
  t.deepEqual(node, unary("foo", term(ident("a"))));
});

test("unary ignores following space", (t) => {
  /** @type {Token[]} */
  const tokens = [
    { type: "prefix", name: "foo" },
    { type: "space", value: " " },
    { type: "ident", value: "a" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 3);
  t.deepEqual(node, unary("foo", term(ident("a"))));
});

test("single term binary", (t) => {
  /** @type {Token[]} */
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "ident", value: "a" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.deepEqual(node, binary("foo", [term(ident("a")), term()]));
});

test("single term binary with trailing space", (t) => {
  /** @type {Token[]} */
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "space", value: " " },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.deepEqual(node, binary("foo", [term(ident("a")), term()]));
});

test("dual term binary", (t) => {
  /** @type {Token[]} */
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
    { type: "ident", value: "b" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 4);
  t.deepEqual(node, binary("foo", [term(ident("a")), term(ident("b"))]));
});

test("dual term binary root reverses terms", (t) => {
  const tokens = [
    { type: "prefix", name: "root", arity: 2 },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
    { type: "ident", value: "b" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 4);
  t.deepEqual(node, binary("root", [term(ident("b")), term(ident("a"))]));
});

test("unary with attrs", (t) => {
  const tokens = [{ type: "prefix", name: "foo", attrs: { bar: "baz" } }];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.deepEqual(node, { ...unary("foo", term()), attrs: { bar: "baz" } });
});

test("binary with attrs", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2, attrs: { bar: "baz" } },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.deepEqual(node, {
    ...binary("foo", [term(), term()]),
    attrs: { bar: "baz" },
  });
});

test("unary with accent", (t) => {
  const tokens = [{ type: "prefix", name: "foo", accent: "bar" }];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.deepEqual(node, { ...unary("foo", term()), accent: "bar" });
});

test("a fenced unary", (t) => {
  const tokens = [
    { type: "prefix", name: "foo" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
    { type: "doesnt.matter", value: "wont reach" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 6);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 1);
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 2);
});

test("a fenced binary", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
    { type: "doesnt.matter", value: "wont reach" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 6);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 2);

  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].value, "a");

  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 1);
  t.is(node.items[1].items[0].value, "b");
});

test("a fenced binary root reverses terms", (t) => {
  const tokens = [
    { type: "prefix", name: "root", arity: 2 },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
    { type: "doesnt.matter", value: "wont reach" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 6);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "root");
  t.is(node.items.length, 2);

  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].value, "b");

  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 1);
  t.is(node.items[1].items[0].value, "a");
});

test("a fenced binary left empty", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "paren.open", value: "(" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
    { type: "doesnt.matter", value: "wont reach" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 5);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 2);
});

test("a fenced binary right empty", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "sep.col", value: "," },
    { type: "paren.close", value: ")" },
    { type: "doesnt.matter", value: "wont reach" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 5);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 2);
});

test("a fenced unary with attrs", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", attrs: { bar: "baz" } },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "paren.close", value: ")" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.deepEqual(node.attrs, { bar: "baz" });
});

test("a fenced binary with attrs", (t) => {
  /** @type {Token[]} */
  const tokens = [
    { type: "prefix", name: "foo", arity: 2, attrs: { bar: "baz" } },
    { type: "paren.open", value: "(" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.deepEqual(node.attrs, { bar: "baz" });
});

test("a fenced unary with accent", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", accent: "bar" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "paren.close", value: ")" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.accent, "bar");
});

test("a fenced unboxed unary", (t) => {
  const tokens = [
    { type: "prefix", name: "foo" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "paren.close", value: ")" },
    { type: "doesnt.matter", value: "wont reach" },
  ];
  const { end, node } = prefix({ ...STATE, tokens });

  t.is(end, 4);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 1);
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");
});

test("prefix inside pipes will not include closing pipe", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "prefix", name: "foo" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
  ];

  const { end, node } = prefix({
    ...STATE,
    tokens,
    start: 1,
    stack: [op("|")],
  });

  t.is(end, 4);
  t.deepEqual(node, unary("foo", term(ident("a"))));
});

test("prefix inside double pipes will not include closing pipe", (t) => {
  const tokens = [
    { type: "operator", value: "∥" },
    { type: "prefix", name: "foo" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "∥" },
  ];

  const { end, node } = prefix({
    ...STATE,
    tokens,
    start: 1,
    stack: [op("∥")],
  });

  t.is(end, 4);
  t.deepEqual(node, unary("foo", term(ident("a"))));
});

test("binary prefix inside mismatced pipes will include closing pipe", (t) => {
  const tokens = [
    { type: "operator", value: "∥" },
    { type: "prefix", name: "foo" },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
  ];

  const { end, node } = prefix({
    ...STATE,
    tokens,
    start: 1,
    stack: [op("∥")],
  });

  t.is(end, 5);
  t.deepEqual(node, unary("foo", term(ident("a"), op("|"))));
});

test("binary prefix inside pipes will include closing pipe", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "prefix", name: "foo", arity: 2 },
    SPACE,
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
  ];

  const { end, node } = prefix({
    ...STATE,
    tokens,
    start: 1,
    stack: [op("|")],
  });

  t.is(end, 5);
  t.deepEqual(node, binary("foo", [term(ident("a"), op("|")), term()]));
});
