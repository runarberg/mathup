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

  t.deepEqual(node2.node.attrs, { width: "1ex" });
  t.deepEqual(node3.node.attrs, { width: "2ex" });
});

test("depth", (t) => {
  const node1 = space({ start: 0, tokens: [{ type: "space", value: "\n" }] });
  const node2 = space({ start: 0, tokens: [{ type: "space", value: "\n\n" }] });

  t.deepEqual(node1.node.attrs, { depth: "1em" });
  t.deepEqual(node2.node.attrs, { depth: "2em" });
});
