import test from "ava";

import prefix from "./prefix.mjs";

test("empty unary", (t) => {
  const tokens = [{ type: "prefix", name: "foo" }];
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= 1);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.deepEqual(node.items, [
    {
      type: "Term",
      items: [],
    },
  ]);
});

test("empty binary", (t) => {
  const tokens = [{ type: "prefix", name: "foo", arity: 2 }];
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= 1);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.deepEqual(node.items, [
    {
      type: "Term",
      items: [],
    },
    {
      type: "Term",
      items: [],
    },
  ]);
});

test("single term unary", (t) => {
  const tokens = [
    { type: "prefix", name: "foo" },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
    { type: "doesnt.matter", value: "wont reach" },
  ];
  const { end, node } = prefix({ start: 0, tokens });

  t.is(end, 2);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 1);

  // A singleton term or an unboxed literal, doesn’t matter.
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");
});

test("unary ignores following space", (t) => {
  const tokens = [
    { type: "prefix", name: "foo" },
    { type: "space", value: " " },
    { type: "ident", value: "a" },
  ];
  const { end, node } = prefix({ start: 0, tokens });

  t.is(end, 3);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 1);

  // A singleton term or an unboxed literal, doesn’t matter.
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");
});

test("single term binary", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "ident", value: "a" },
  ];
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 2);

  // A singleton term or an unboxed literal, doesn’t matter.
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");

  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 0);
});

test("single term binary with trailing space", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "space", value: " " },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
  ];
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 2);

  // A singleton term or an unboxed literal, doesn’t matter.
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");

  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 0);
});

test("dual term binary", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2 },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
    { type: "ident", value: "b" },
  ];
  const { end, node } = prefix({ start: 0, tokens });

  t.is(end, 4);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 2);

  // A singleton term or an unboxed literal, doesn’t matter.
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");
  t.is(node.items[0].items[0].value, "a");

  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 1);
  t.is(node.items[1].items[0].type, "IdentLiteral");
  t.is(node.items[1].items[0].value, "b");
});

test("dual term binary root reverses terms", (t) => {
  const tokens = [
    { type: "prefix", name: "root", arity: 2 },
    { type: "ident", value: "a" },
    { type: "space", value: " " },
    { type: "ident", value: "b" },
  ];
  const { end, node } = prefix({ start: 0, tokens });

  t.is(end, 4);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "root");
  t.is(node.items.length, 2);

  // A singleton term or an unboxed literal, doesn’t matter.
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");
  t.is(node.items[0].items[0].value, "b");

  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 1);
  t.is(node.items[1].items[0].type, "IdentLiteral");
  t.is(node.items[1].items[0].value, "a");
});

test("unary with attrs", (t) => {
  const tokens = [{ type: "prefix", name: "foo", attrs: { bar: "baz" } }];
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.deepEqual(node.attrs, { bar: "baz" });
});

test("binary with attrs", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2, attrs: { bar: "baz" } },
  ];
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "foo");
  t.deepEqual(node.attrs, { bar: "baz" });
});

test("unary with accent", (t) => {
  const tokens = [{ type: "prefix", name: "foo", accent: "bar" }];
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.accent, "bar");
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
  const { end, node } = prefix({ start: 0, tokens });

  t.is(end, 6);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 1);
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 3);
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
  const { end, node } = prefix({ start: 0, tokens });

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
  const { end, node } = prefix({ start: 0, tokens });

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
  const { end, node } = prefix({ start: 0, tokens });

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
  const { end, node } = prefix({ start: 0, tokens });

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
  const { end, node } = prefix({ start: 0, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.deepEqual(node.attrs, { bar: "baz" });
});

test("a fenced binary with attrs", (t) => {
  const tokens = [
    { type: "prefix", name: "foo", arity: 2, attrs: { bar: "baz" } },
    { type: "paren.open", value: "(" },
  ];
  const { end, node } = prefix({ start: 0, tokens });

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
  const { end, node } = prefix({ start: 0, tokens });

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
  const { end, node } = prefix({ start: 0, tokens });

  t.is(end, 4);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "foo");
  t.is(node.items.length, 1);
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 1);
  t.is(node.items[0].items[0].type, "IdentLiteral");
});
