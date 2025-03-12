import test from "ava";

import space from "./space.js";

test("SpaceLiteral", (t) => {
  const { end, node } = space({
    start: 0,
    tokens: [{ type: "space", value: "  " }],
  });

  t.is(end, 1);
  t.is(node.type, "SpaceLiteral");
});

test("width", (t) => {
  const node2 = space({ start: 0, tokens: [{ type: "space", value: "  " }] });
  const node3 = space({ start: 0, tokens: [{ type: "space", value: "   " }] });
  const node4 = space({ start: 0, tokens: [{ type: "space", value: "    " }] });
  const node5 = space({
    start: 0,
    tokens: [{ type: "space", value: "     " }],
  });
  const node6 = space({
    start: 0,
    tokens: [{ type: "space", value: "      " }],
  });
  const node7 = space({
    start: 0,
    tokens: [{ type: "space", value: "       " }],
  });

  t.deepEqual(node2.node.attrs, { width: "0.35ex" });
  t.deepEqual(node3.node.attrs, { width: "0.7ex" });
  t.deepEqual(node4.node.attrs, { width: "1.5ex" });
  t.deepEqual(node5.node.attrs, { width: "2ex" });
  t.deepEqual(node6.node.attrs, { width: "3ex" });
  t.deepEqual(node7.node.attrs, { width: "4ex" });
});

test("newline", (t) => {
  const node1 = space({ start: 0, tokens: [{ type: "space", value: "\n" }] });
  const node2 = space({ start: 0, tokens: [{ type: "space", value: "\n  " }] });

  t.deepEqual(node1.node.attrs, { width: "0ex" });
  t.deepEqual(node2.node.attrs, { width: "0ex" });
});
