import test from "ava";

import operator from "./operator.js";

test("reject non-operator", (t) => {
  t.is(operator(" ", " + 1", { start: 0, grouping: false }), null);
});

test("single plus is operator", (t) => {
  const token = operator("+", " + 1", { start: 1, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "+");
  t.is(token?.end, 2);
});

test("stops after first operator", (t) => {
  const token = operator("+", " ++ 1", { start: 1, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "+");
  t.is(token?.end, 2);
});

test("known operator", (t) => {
  const token = operator("+", " +- 1", { start: 1, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "±");
  t.is(token?.end, 3);
});

test("emits the longest possible known operator", (t) => {
  const token = operator("^", "^^^ 1", { start: 0, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "⋀");
  t.is(token?.end, 3);
});

test("some operators are group separators", (t) => {
  const token = operator(":|:", "0 :|: 1", { start: 2, grouping: true });

  t.is(token?.type, "sep.col");
  t.is(token?.value, "|");
  t.deepEqual(token?.attrs, { stretchy: true });
  t.is(token?.end, 5);
});

test("when not grouping, they are just operators", (t) => {
  const token = operator(":|:", "0 :|: 1", { start: 2, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "|");
  t.deepEqual(token?.attrs, { stretchy: true });
  t.is(token?.end, 5);
});

test("some operators are commands", (t) => {
  const token = operator("\u{1f534}", "\u{1f534}a", {
    start: 0,
    grouping: false,
  });

  t.is(token?.type, "command");
  t.is(token?.name, "color");
  t.is(token?.value, "red");
  t.is(token?.end, 2);
});

test("add stretch to pipe when space surrounded", (t) => {
  const token = operator("|", "a | b", { start: 2, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "|");
  t.is(token?.attrs?.stretchy, true);
  t.is(token?.end, 3);
});

test("don’t stretch pipe without space", (t) => {
  const token = operator("|", "a|b", { start: 1, grouping: false });

  t.is(token?.type, "operator");
  t.is(token?.value, "|");
  t.falsy(token?.attrs?.stretchy);
  t.is(token?.end, 2);
});
