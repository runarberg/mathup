import test from "ava";
import backtick from "./backtick.mjs";

test("rejects non-backtick", (t) => {
  t.is(backtick("a", "a `b` c", { start: 0 }), null);
});

test("fenced", (t) => {
  t.deepEqual(backtick("`", "`a bc`", { start: 0 }), {
    type: "ident",
    value: "a bc",
    end: 6,
  });
});

test("fenced no-close", (t) => {
  t.deepEqual(backtick("`", "`foo bar", { start: 0 }), {
    type: "ident",
    value: "foo bar",
    end: 8,
  });
});

test("fenced with inner backtics", (t) => {
  t.deepEqual(backtick("`", "`` `int` ``", { start: 0 }), {
    type: "ident",
    value: "`int`",
    end: 11,
  });
});
