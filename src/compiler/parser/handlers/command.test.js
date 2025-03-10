import test from "ava";

import command from "./command.js";

test("no opperant", (t) => {
  const tokens = [{ type: "command", name: "foo" }];
  const { end, node } = command({ start: 0, tokens });

  t.true(end >= tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "command");
  t.deepEqual(node.items, [{ type: "Term", items: [] }]);
});

test("unknown command", (t) => {
  const tokens = [
    { type: "command", name: "unknown" },
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "command");
  t.deepEqual(node.items, [
    {
      type: "Term",
      items: [
        {
          type: "IdentLiteral",
          value: "A",
        },
      ],
    },
  ]);
});

test("single text-transform", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.deepEqual(node.items, [
    {
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf"],
      items: [
        {
          type: "IdentLiteral",
          value: "A",
        },
      ],
    },
  ]);
});

test("double text-transform", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "command", name: "text-transform", value: "it" },
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.deepEqual(node.items, [
    {
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf", "it"],
      items: [
        {
          type: "IdentLiteral",
          value: "A",
        },
      ],
    },
  ]);
});

test("double text-transform with spaces", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "space", value: " " },
    { type: "command", name: "text-transform", value: "it" },
    { type: "space", value: " " },
    { type: "ident", value: "A" },
  ];
  const { end, node } = command({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.deepEqual(node.items, [
    {
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf", "it"],
      items: [
        {
          type: "IdentLiteral",
          value: "A",
        },
      ],
    },
  ]);
});

test("text-transform with following term", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
  ];
  const { end, node } = command({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.deepEqual(node.items, [
    {
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf"],
      items: [
        {
          type: "IdentLiteral",
          value: "A",
        },
      ],
    },
    {
      type: "IdentLiteral",
      value: "b",
    },
  ]);
});

test("multiple text-transform with following term", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "command", name: "text-transform", value: "it" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
  ];
  const { end, node } = command({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "Term");
  t.deepEqual(node.items, [
    {
      type: "UnaryOperation",
      name: "command",
      transforms: ["bf", "it"],
      items: [
        {
          type: "IdentLiteral",
          value: "A",
        },
      ],
    },
    {
      type: "IdentLiteral",
      value: "b",
    },
  ]);
});

test("text and style command with following term", (t) => {
  const tokens = [
    { type: "command", name: "color", value: "red" },
    { type: "command", name: "text-transform", value: "bf" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
  ];

  const { end, node } = command({ start: 0, tokens });

  t.is(end, tokens.length);
  t.is(node.type, "UnaryOperation");
  t.deepEqual(node.styles, new Map([["color", "red"]]));
  t.deepEqual(node.items, [
    {
      type: "Term",
      items: [
        {
          type: "UnaryOperation",
          name: "command",
          transforms: ["bf"],
          items: [
            {
              type: "IdentLiteral",
              value: "A",
            },
          ],
        },
        {
          type: "IdentLiteral",
          value: "b",
        },
      ],
    },
  ]);
});

test("text-transform on a group", (t) => {
  const tokens = [
    { type: "command", name: "text-transform", value: "bf" },
    { type: "paren.open", value: "(" },
    { type: "ident", value: "A" },
    { type: "ident", value: "b" },
    { type: "paren.close", value: ")" },
  ];
  const { end, node } = command({ start: 0, tokens });

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
  const { end, node } = command({ start: 0, tokens });

  t.is(end, 5);
  t.is(node.type, "UnaryOperation");
  t.is(node.name, "command");
  t.is(node.items.length, 1);
});
