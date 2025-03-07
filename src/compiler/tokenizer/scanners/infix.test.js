import test from "ava";

import infix from "./infix.js";

test("Rejects non-infix", (t) => {
  t.is(infix(" ", "a/b", { start: 0 }), null);
});

test("Single slash is frac infix", (t) => {
  const token = infix("/", "a/b", { start: 1 });

  t.is(token?.type, "infix");
  t.is(token?.value, "frac");
  t.is(token?.end, 2);
});

test("Single caret is sup infix", (t) => {
  const token = infix("^", "a^b", { start: 1 });

  t.is(token?.type, "infix");
  t.is(token?.value, "sup");
  t.is(token?.end, 2);
});

test("Single underscore is sub infix", (t) => {
  const token = infix("_", "a_b", { start: 1 });

  t.is(token?.type, "infix");
  t.is(token?.value, "sub");
  t.is(token?.end, 2);
});

test(".^ is over infix", (t) => {
  const token = infix(".^", "a.^b", { start: 1 });

  t.is(token?.type, "infix");
  t.is(token?.value, "over");
  t.is(token?.end, 2);
});

test("._ is under infix", (t) => {
  const token = infix("._", "a._b", { start: 1 });

  t.is(token?.type, "infix");
  t.is(token?.value, "under");
  t.is(token?.end, 2);
});

test("A known op is not an infix", (t) => {
  t.is(infix("/", "a/_\\b", { start: 1 }), null);
  t.is(infix("^", "a^^b", { start: 1 }), null);
});

test("period + known op is not an infix", (t) => {
  t.is(infix(".", "a.^^b", { start: 1 }), null);
});
