import test from "ava";

import group from "./group.js";

test("empty unfenced group", (t) => {
  const tokens = [
    { type: "paren.open", value: "" },
    { type: "paren.close", value: "" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 2);
  t.deepEqual(node, {
    type: "FencedGroup",
    items: [],
    attrs: {
      open: "",
      close: "",
      seps: [],
    },
  });
});

test("empty fenced group", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "paren.close", value: ")" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 2);
  t.deepEqual(node, {
    type: "FencedGroup",
    items: [],
    attrs: {
      open: "(",
      close: ")",
      seps: [],
    },
  });
});

test("empty unclosed group", (t) => {
  const tokens = [{ type: "paren.open", value: "" }];

  const { end, node } = group({ start: 0, tokens });

  t.true(end >= 1);
  t.deepEqual(node, {
    type: "FencedGroup",
    items: [],
    attrs: {
      open: "",
      close: "",
      seps: [],
    },
  });
});

test("group with one sep", (t) => {
  const tokens = [
    { type: "paren.open", value: "" },
    { type: "sep.col", value: "," },
    { type: "paren.close", value: "" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 3);
  t.deepEqual(node, {
    type: "FencedGroup",
    items: [[]],
    attrs: {
      seps: [","],
      open: "",
      close: "",
    },
  });
});

test("unclosed group with one sep", (t) => {
  const tokens = [
    { type: "paren.open", value: "foo" },
    { type: "sep.col", value: "," },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.true(end >= 2);
  t.deepEqual(node, {
    type: "FencedGroup",
    items: [[]],
    attrs: {
      seps: [","],
      open: "foo",
      close: "",
    },
  });
});

test("group with multiple seps", (t) => {
  const tokens = [
    { type: "paren.open", value: "" },
    { type: "sep.col", value: "," },
    { type: "sep.col", value: "," },
    { type: "ident", value: "a" },
    { type: "ident", value: "b" },
    { type: "paren.close", value: "" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 6);
  t.is(node.items.length, 3);
  t.is(node.items[0].length, 0);
  t.is(node.items[1].length, 0);
  t.true(node.items[2].length > 0);
  t.is(node.attrs.open, "");
  t.is(node.attrs.close, "");
  t.deepEqual(node.attrs.seps, [",", ","]);
});

test("unclosed group with multiple seps", (t) => {
  const tokens = [
    { type: "paren.open", value: "" },
    { type: "sep.col", value: "," },
    { type: "sep.col", value: "," },
    { type: "ident", value: "a" },
    { type: "ident", value: "b" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.true(end >= 6);
  t.is(node.items.length, 3);
  t.is(node.items[0].length, 0);
  t.is(node.items[1].length, 0);
  t.true(node.items[2].length > 0);
  t.is(node.attrs.open, "");
  t.is(node.attrs.close, "");
  t.deepEqual(node.attrs.seps, [",", ","]);
});

test("ignores leading spaces", (t) => {
  const tokens = [
    { type: "paren.open", value: "" },
    { type: "space", value: " " },
    { type: "sep.col", value: "," },
    { type: "space", value: " " },
    { type: "paren.close", value: "" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 5);
  t.deepEqual(node, {
    type: "FencedGroup",
    items: [[]],
    attrs: {
      seps: [","],
      open: "",
      close: "",
    },
  });
});

test("matrix groups", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "sep.row", value: ";" },
    { type: "paren.close", value: ")" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 3);
  t.is(node.type, "MatrixGroup");
  t.is(node.attrs.open, "(");
  t.is(node.attrs.close, ")");
  t.deepEqual(node.items, [[[]]]);
});

test("matrix groups with items", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "ident", value: "foo" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "bar" },
    { type: "sep.row", value: ";" },
    { type: "ident", value: "baz" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "quux" },
    { type: "paren.close", value: ")" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 9);
  t.is(node.type, "MatrixGroup");
  t.is(node.attrs.open, "(");
  t.is(node.attrs.close, ")");
  t.is(node.items.length, 2);
  t.is(node.items[0].length, 2);
  t.is(node.items[1].length, 2);
  t.true(node.items[0][0].length > 0);
  t.true(node.items[0][1].length > 0);
  t.true(node.items[1][0].length > 0);
  t.true(node.items[1][1].length > 0);
});

test("unclosed matrix with one sep", (t) => {
  const tokens = [
    { type: "paren.open", value: "foo" },
    { type: "sep.row", value: ";" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.true(end >= 2);
  t.is(node.type, "MatrixGroup");
  t.is(node.attrs.open, "foo");
  t.is(node.attrs.close, "");
  t.deepEqual(node.items, [[[]]]);
});

test("sparce matrix groups", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "bar" },
    { type: "sep.row", value: ";" },
    { type: "ident", value: "baz" },
    { type: "sep.col", value: "," },
    { type: "paren.close", value: ")" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 7);
  t.is(node.type, "MatrixGroup");
  t.is(node.attrs.open, "(");
  t.is(node.attrs.close, ")");
  t.is(node.items.length, 2);
  t.is(node.items[0].length, 2);
  t.is(node.items[1].length, 1);
  t.is(node.items[0][0].length, 0);
  t.true(node.items[0][1].length > 0);
  t.true(node.items[1][0].length > 0);
});

test("single line matrix groups", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "ident", value: "foo" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "bar" },
    { type: "sep.row", value: ";" },
    { type: "paren.close", value: ")" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 6);
  t.is(node.type, "MatrixGroup");
  t.is(node.attrs.open, "(");
  t.is(node.attrs.close, ")");
  t.is(node.items.length, 1);
  t.is(node.items[0].length, 2);
  t.true(node.items[0][0].length > 0);
  t.true(node.items[0][1].length > 0);
});

test("unclosed matrix groups", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "ident", value: "foo" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "bar" },
    { type: "sep.row", value: ";" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.true(end >= 5);
  t.is(node.type, "MatrixGroup");
  t.is(node.attrs.open, "(");
  t.is(node.attrs.close, "");
  t.is(node.items.length, 1);
  t.is(node.items[0].length, 2);
  t.true(node.items[0][0].length > 0);
  t.true(node.items[0][1].length > 0);
});

test("ignores leading spaces in matrix groups", (t) => {
  const tokens = [
    { type: "paren.open", value: "" },
    { type: "space", value: " " },
    { type: "sep.col", value: "," },
    { type: "space", value: " " },
    { type: "sep.row", value: ";" },
    { type: "space", value: " " },
    { type: "paren.close", value: "" },
  ];

  const { end, node } = group({ start: 0, tokens });

  t.is(end, 7);
  t.is(node.type, "MatrixGroup");
  t.is(node.attrs.open, "");
  t.is(node.attrs.close, "");
  t.deepEqual(node.items, [[[], []]]);
});
