import test from "ava";

import quote from "./quote.js";

test("rejects non-quote", (t) => {
  t.is(quote("a", 'a "b" c', { start: 0 }), null);
});

test("fenced", (t) => {
  t.deepEqual(quote('"', '"a bc"', { start: 0 }), {
    type: "text",
    value: "a bc",
    end: 6,
  });
});

test("fenced no-close", (t) => {
  t.deepEqual(quote('"', '"foo bar', { start: 0 }), {
    type: "text",
    value: "foo bar",
    end: 8,
  });
});

test("fenced with inner backtics", (t) => {
  t.deepEqual(quote('"', '"" "int" ""', { start: 0 }), {
    type: "text",
    value: '"int"',
    end: 11,
  });
});
