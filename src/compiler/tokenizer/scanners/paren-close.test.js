import test from "ava";

import parenClose from "./paren-close.js";

test("rejects non-close-paren", (t) => {
  t.is(parenClose(" ", "a(b)", { start: 0, grouping: true }), null);
});

test("rejects close-paren in non-grouping context", (t) => {
  t.is(parenClose(")", "a(b)", { start: 4, grouping: false }), null);
});

test("single paren-close", (t) => {
  t.deepEqual(parenClose(")", "a(b)", { start: 4, grouping: true }), {
    type: "paren.close",
    value: ")",
    end: 5,
  });
});

test("combined paren-close", (t) => {
  t.deepEqual(parenClose(":", ":)", { start: 0, grouping: true }), {
    type: "paren.close",
    value: "⟩",
    end: 2,
  });

  t.deepEqual(parenClose(":", ":}", { start: 0, grouping: true }), {
    type: "paren.close",
    value: "",
    end: 2,
  });
});
