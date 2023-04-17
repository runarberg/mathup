import test from "ava";
import backslash from "./backslash.js";

test("rejects non-backslash", (t) => {
  t.is(backslash("a", "a \\b c", { start: 0 }), null);
});

test("single char", (t) => {
  t.deepEqual(backslash("\\", "a \\b c", { start: 2 }), {
    type: "operator",
    value: "b",
    end: 4,
  });
});

test("multi chars", (t) => {
  t.deepEqual(backslash("\\", "a \\bcd e", { start: 2 }), {
    type: "operator",
    value: "bcd",
    end: 6,
  });
});

test("multi chars trailing", (t) => {
  t.deepEqual(backslash("\\", "a \\bcd", { start: 2 }), {
    type: "operator",
    value: "bcd",
    end: 6,
  });
});

test("fenced", (t) => {
  t.deepEqual(backslash("\\", "\\`\\a bc`", { start: 0 }), {
    type: "operator",
    value: "\\a bc",
    end: 8,
  });
});

test("fenced no-close", (t) => {
  t.deepEqual(backslash("\\", "\\`foo bar", { start: 0 }), {
    type: "operator",
    value: "foo bar",
    end: 9,
  });
});

test("fenced with inner backtics", (t) => {
  t.deepEqual(backslash("\\", "\\`` `int` ``", { start: 0 }), {
    type: "operator",
    value: "`int`",
    end: 12,
  });
});
