import test from "ava";
import alpha from "./alpha.js";

test("rejects non-alpha", (t) => {
  t.is(alpha(" ", " a bc", { start: 0 }), null);
});

test("single alpha is ident", (t) => {
  const token = alpha("a", " a bc", { start: 1 });

  t.is(token.type, "ident");
  t.is(token.value, "a");
  t.is(token.end, 2);
  t.is(token.split, true);
});

test("subsequent alphas are separate ident", (t) => {
  const token = alpha("b", "bc ", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "bc");
  t.is(token.end, 2);
  t.is(token.split, true);
});

test("stops scanning on numeric", (t) => {
  const token = alpha("d", "de2", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "de");
  t.is(token.end, 2);
  t.is(token.split, true);
});

test("trailing alphas", (t) => {
  const token = alpha("a", " abc", { start: 1 });

  t.is(token.type, "ident");
  t.is(token.value, "abc");
  t.is(token.end, 4);
  t.is(token.split, true);
});

test("known ident maps", (t) => {
  const token = alpha("p", "pi", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "π");
  t.is(token.end, 2);
  t.falsy(token.split);
});

test("known ident greedy", (t) => {
  const token = alpha("s", "sinh", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "sinh");
  t.is(token.end, 4);
  t.falsy(token.split);
});

test("substrings are not known idents", (t) => {
  const token = alpha("s", "sinfoo", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "sinfoo");
  t.is(token.end, 6);
  t.is(token.split, true);
});

test("known ident with symbol", (t) => {
  const token = alpha("O", "O/", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "∅");
  t.is(token.end, 2);
  t.falsy(token.split);
});

test("known ident with symbol cannot be followed with an alphanum", (t) => {
  const token = alpha("O", "O/1", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "O");
  t.is(token.end, 1);
  t.is(token.split, true);
});

test("known operators", (t) => {
  const token = alpha("n", "not", { start: 0 });

  t.is(token.type, "operator");
  t.is(token.value, "¬");
  t.is(token.end, 3);
  t.falsy(token.split);
});

test("known operator with symbol", (t) => {
  const token = alpha("o", "o+", { start: 0 });

  t.is(token.type, "operator");
  t.is(token.value, "⊕");
  t.is(token.end, 2);
  t.falsy(token.split);
});

test("known operator with symbol cannot be followed by an alphanum", (t) => {
  const token = alpha("o", "o+o", { start: 0 });

  t.is(token.type, "ident");
  t.is(token.value, "o");
  t.is(token.end, 1);
  t.is(token.split, true);
});
