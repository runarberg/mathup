import test from "ava";

import {
  SPACE,
  STATE,
  binary,
  ident,
  op,
  space,
  term,
} from "./__test__/utils.js";
import infix from "./infix.js";

test("empty binary infix", (t) => {
  const tokens = [{ type: "infix", value: "frac" }];
  const { end, node } = infix({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(node, binary("frac", [term(), term()]));
});

test("empty sup", (t) => {
  const tokens = [{ type: "infix", value: "sup" }];
  const { end, node } = infix({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(node, binary("sup", [term(), term()]));
});

test("leading frac", (t) => {
  const tokens = [
    { type: "infix", value: "frac" },
    { type: "ident", value: "a" },
  ];
  const { end, node } = infix({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(node, binary("frac", [term(), ident("a")]));
});

test("leading sub", (t) => {
  const tokens = [
    { type: "infix", value: "sub" },
    { type: "ident", value: "a" },
  ];
  const { end, node } = infix({ ...STATE, tokens });

  t.is(end, tokens.length);
  t.deepEqual(node, binary("sub", [term(), ident("a")]));
});

test("trailing frac", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "frac" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 1,
    stack: [ident("a")],
    tokens,
  });

  t.is(end, tokens.length);
  t.deepEqual(node, binary("frac", [ident("a"), term()]));
});

test("trailing over", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "over" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 1,
    stack: [ident("a")],
    tokens,
  });

  t.is(end, tokens.length);
  t.deepEqual(node, binary("over", [ident("a"), term()]));
});

test("simple frac", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "frac" },
    { type: "ident", value: "b" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 1,
    stack: [ident("a")],
    tokens,
  });

  t.is(end, 3);
  t.deepEqual(node, binary("frac", [ident("a"), ident("b")]));
});

test("simple over", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "over" },
    { type: "ident", value: "b" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 1,
    stack: [ident("a")],
    tokens,
  });

  t.is(end, 3);
  t.deepEqual(node, binary("over", [ident("a"), ident("b")]));
});

test("single term subsup", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sub" },
    { type: "ident", value: "b" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "c" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 3,
    stack: [binary("sub", [ident("a"), ident("b")])],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, {
    type: "TernaryOperation",
    name: "subsup",
    items: [ident("a"), ident("b"), ident("c")],
  });
});

test("single term supsub", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "b" },
    { type: "infix", value: "sub" },
    { type: "ident", value: "c" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 3,
    stack: [binary("sup", [ident("a"), ident("b")])],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, {
    type: "TernaryOperation",
    name: "subsup",
    items: [ident("a"), ident("c"), ident("b")],
  });
});

test("single term underover", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "under" },
    { type: "ident", value: "b" },
    { type: "infix", value: "over" },
    { type: "ident", value: "c" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 3,
    stack: [binary("under", [ident("a"), ident("b")])],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, {
    type: "TernaryOperation",
    name: "underover",
    items: [ident("a"), ident("b"), ident("c")],
  });
});

test("single term overunder", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "over" },
    { type: "ident", value: "b" },
    { type: "infix", value: "under" },
    { type: "ident", value: "c" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 3,
    stack: [binary("over", [ident("a"), ident("b")])],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, {
    type: "TernaryOperation",
    name: "underover",
    items: [ident("a"), ident("c"), ident("b")],
  });
});

test("frac with space after", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "frac" },
    SPACE,
    { type: "ident", value: "b" },
    { type: "ident", value: "c" },
    SPACE,
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 1,
    stack: [ident("a")],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, binary("frac", [ident("a"), term(ident("b"), ident("c"))]));
});

test("sup with space after", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sup" },
    SPACE,
    { type: "ident", value: "b" },
    { type: "ident", value: "c" },
    SPACE,
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 1,
    stack: [ident("a")],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, binary("sup", [ident("a"), term(ident("b"), ident("c"))]));
});

test("frac with space before", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "ident", value: "b" },
    SPACE,
    { type: "infix", value: "frac" },
    { type: "ident", value: "c" },
    SPACE,
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 3,
    stack: [term(ident("a"), ident("b")), space()],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(node, binary("frac", [term(ident("a"), ident("b")), ident("c")]));
});

test("under with space before", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "ident", value: "b" },
    SPACE,
    { type: "infix", value: "under" },
    { type: "ident", value: "c" },
    SPACE,
    { type: "what.ever", value: "don’t matter" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 3,
    stack: [term(ident("a"), ident("b")), space()],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(
    node,
    binary("under", [term(ident("a"), ident("b")), ident("c")]),
  );
});

test("removes fences around fracs", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
    { type: "infix", value: "frac" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "c" },
    { type: "ident", value: "d" },
    { type: "paren.close", value: ")" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const stack = [
    {
      type: "FencedGroup",
      items: [
        [
          { type: "IdentLiteral", value: "a" },
          { type: "IdentLiteral", value: "b" },
        ],
      ],
      attrs: {
        open: "(",
        close: ")",
      },
    },
  ];

  const { end, node } = infix({ start: 4, stack, tokens });

  t.is(end, 9);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "frac");
  t.is(node.items.length, 2);
  t.is(node.items[0].type, "Term");
  t.is(node.items[0].items.length, 2);
  t.is(node.items[0].items[0].value, "a");
  t.is(node.items[0].items[1].value, "b");
  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 2);
  t.is(node.items[1].items[0].value, "c");
  t.is(node.items[1].items[1].value, "d");
});

test("removes fences around sup exponents", (t) => {
  const tokens = [
    { type: "paren.open", value: "(" },
    { type: "ident", value: "a" },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
    { type: "infix", value: "sup" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "c" },
    { type: "ident", value: "d" },
    { type: "paren.close", value: ")" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const stack = [
    {
      type: "FencedGroup",
      items: [
        [
          { type: "IdentLiteral", value: "a" },
          { type: "IdentLiteral", value: "b" },
        ],
      ],
      attrs: {
        open: "(",
        close: ")",
      },
    },
  ];

  const { end, node } = infix({ start: 4, stack, tokens });

  t.is(end, 9);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "sup");
  t.is(node.items.length, 2);
  t.is(node.items[0].type, "FencedGroup");
  t.is(node.items[0].attrs.open, "(");
  t.is(node.items[0].attrs.close, ")");
  t.is(node.items[1].type, "Term");
  t.is(node.items[1].items.length, 2);
  t.is(node.items[1].items[0].value, "c");
  t.is(node.items[1].items[1].value, "d");
});

test("but keeps a singleton exponent in fences", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sup" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "c" },
    { type: "paren.close", value: ")" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const stack = [{ type: "IdentLiteral", value: "a" }];
  const { end, node } = infix({ start: 1, stack, tokens });

  t.is(end, 5);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "sup");
  t.is(node.items.length, 2);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].type, "FencedGroup");
  t.is(node.items[1].attrs.open.value, "(");
  t.is(node.items[1].attrs.close.value, ")");
});

test("but keeps multi-celled in fences", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sub" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "b" },
    { type: "sep.col", value: "," },
    { type: "ident", value: "c" },
    { type: "paren.close", value: ")" },
    { type: "what.ever", value: "don’t matter" },
  ];

  const stack = [{ type: "IdentLiteral", value: "a" }];
  const { end, node } = infix({ start: 1, stack, tokens });

  t.is(end, 7);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "sub");
  t.is(node.items.length, 2);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].type, "FencedGroup");
  t.is(node.items[1].attrs.open.value, "(");
  t.is(node.items[1].attrs.close.value, ")");
});

test("puts pipe delimited as base", (t) => {
  const tokens = [
    { type: "operator", value: "|" },
    { type: "ident", value: "a" },
    { type: "operator", value: "|" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "x" },
  ];

  const { end, node } = infix({
    ...STATE,
    start: 3,
    stack: [op("|"), ident("a"), op("|")],
    tokens,
  });

  t.is(end, 5);
  t.deepEqual(
    node,
    binary("sup", [term(op("|"), ident("a"), op("|")), ident("x")]),
  );
});

test("chains sub sup into subsup ternary", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sub" },
    { type: "ident", value: "i" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "x" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "sub",
      items: [
        { type: "OperatorLiteral", value: "a" },
        { type: "IdentLiteral", value: "i" },
      ],
    },
  ];
  const { end, node } = infix({ start: 3, stack, tokens });

  t.is(end, 5);
  t.is(node.name, "subsup");
  t.is(node.items.length, 3);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].value, "i");
  t.is(node.items[2].value, "x");
});

test("chains sup sub into subsup ternary", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "x" },
    { type: "infix", value: "sub" },
    { type: "ident", value: "i" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "sup",
      items: [
        { type: "OperatorLiteral", value: "a" },
        { type: "IdentLiteral", value: "x" },
      ],
    },
  ];
  const { end, node } = infix({ start: 3, stack, tokens });

  t.is(end, 5);
  t.is(node.name, "subsup");
  t.is(node.items.length, 3);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].value, "i");
  t.is(node.items[2].value, "x");
});

test("chains under over into underover ternary", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "under" },
    { type: "ident", value: "i" },
    { type: "infix", value: "over" },
    { type: "ident", value: "x" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "under",
      items: [
        { type: "OperatorLiteral", value: "a" },
        { type: "IdentLiteral", value: "i" },
      ],
    },
  ];
  const { end, node } = infix({ start: 3, stack, tokens });

  t.is(end, 5);
  t.is(node.name, "underover");
  t.is(node.items.length, 3);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].value, "i");
  t.is(node.items[2].value, "x");
});

test("chains over under into underover ternary", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "over" },
    { type: "ident", value: "x" },
    { type: "infix", value: "under" },
    { type: "ident", value: "i" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "over",
      items: [
        { type: "OperatorLiteral", value: "a" },
        { type: "IdentLiteral", value: "x" },
      ],
    },
  ];
  const { end, node } = infix({ start: 3, stack, tokens });

  t.is(end, 5);
  t.is(node.name, "underover");
  t.is(node.items.length, 3);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].value, "i");
  t.is(node.items[2].value, "x");
});

test("lim subs sub for under", (t) => {
  const tokens = [
    { type: "operator", value: "lim" },
    { type: "infix", value: "sub" },
  ];

  const stack = [{ type: "OperatorLiteral", value: "lim" }];
  const { end, node } = infix({ start: 1, stack, tokens });

  t.true(end >= tokens.length);
  t.is(node.name, "under");
});

test("sum subs subsup for underover", (t) => {
  const tokens = [
    { type: "operator", value: "∑" },
    { type: "infix", value: "sub" },
    { type: "ident", value: "i" },
    { type: "infix", value: "sup" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "sub",
      items: [
        { type: "OperatorLiteral", value: "∑" },
        { type: "IdentLiteral", value: "i" },
      ],
    },
  ];
  const { end, node } = infix({ start: 3, stack, tokens });

  t.true(end >= tokens.length);
  t.is(node.name, "underover");
});

test("no subbing sub for under normally", (t) => {
  const tokens = [
    { type: "operator", value: "normal" },
    { type: "infix", value: "sub" },
  ];

  const stack = [{ type: "OperatorLiteral", value: "normal" }];
  const { end, node } = infix({ start: 1, stack, tokens });

  t.true(end >= tokens.length);
  t.is(node.name, "sub");
});

test("left associates fracs", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "frac" },
    { type: "ident", value: "b" },
    { type: "infix", value: "frac" },
    { type: "ident", value: "c" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "frac",
      items: [
        { type: "IdentLiteral", value: "a" },
        { type: "IdentLiteral", value: "b" },
      ],
    },
  ];

  const { end, node } = infix({ start: 3, stack, tokens });

  t.is(end, 5);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "frac");
  t.is(node.items.length, 2);
  t.is(node.items[0].type, "BinaryOperation");
  t.is(node.items[0].name, "frac");
  t.is(node.items[0].items.length, 2);
  t.is(node.items[0].items[0].value, "a");
  t.is(node.items[0].items[1].value, "b");
  t.is(node.items[1].value, "c");
});

test("right associates sups", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "b" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "c" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "sup",
      items: [
        { type: "IdentLiteral", value: "a" },
        { type: "IdentLiteral", value: "b" },
      ],
    },
  ];

  const { end, node } = infix({ start: 3, stack, tokens });

  t.is(end, 5);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "sup");
  t.is(node.items.length, 2);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].type, "BinaryOperation");
  t.is(node.items[1].name, "sup");
  t.is(node.items[1].items.length, 2);
  t.is(node.items[1].items[0].value, "b");
  t.is(node.items[1].items[1].value, "c");
});

test("right associates sups deeply", (t) => {
  const tokens = [
    { type: "ident", value: "a" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "b" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "c" },
    { type: "infix", value: "sup" },
    { type: "ident", value: "d" },
  ];

  const stack = [
    {
      type: "BinaryOperation",
      name: "sup",
      items: [
        { type: "IdentLiteral", value: "a" },
        {
          type: "BinaryOperation",
          name: "sup",
          items: [
            { type: "IdentLiteral", value: "b" },
            { type: "IdentLiteral", value: "c" },
          ],
        },
      ],
    },
  ];

  const { end, node } = infix({ start: 5, stack, tokens });

  t.is(end, 7);
  t.is(node.type, "BinaryOperation");
  t.is(node.name, "sup");
  t.is(node.items.length, 2);
  t.is(node.items[0].value, "a");
  t.is(node.items[1].type, "BinaryOperation");
  t.is(node.items[1].name, "sup");
  t.is(node.items[1].items.length, 2);
  t.is(node.items[1].items[0].value, "b");
  t.is(node.items[1].items[1].type, "BinaryOperation");
  t.is(node.items[1].items[1].name, "sup");
  t.is(node.items[1].items[1].items.length, 2);
  t.is(node.items[1].items[1].items[0].value, "c");
  t.is(node.items[1].items[1].items[1].value, "d");
});
