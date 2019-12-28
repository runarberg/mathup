import test from "ava";
import alpha from "./alpha.mjs";

test("rejects non-alpha", t => {
  t.is(alpha(" ", " a bc", { start: 0 }), null);
});

test("single alpha is ident", t => {
  t.deepEqual(alpha("a", " a bc", { start: 1 }), {
    type: "ident",
    value: "a",
    end: 2,
    split: true,
  });
});

test("subsequent alphas are separate ident", t => {
  t.deepEqual(alpha("b", "bc ", { start: 0 }), {
    type: "ident",
    value: "bc",
    end: 2,
    split: true,
  });
});

test("stops scanning on numeric", t => {
  t.deepEqual(alpha("d", "de2", { start: 0 }), {
    type: "ident",
    value: "de",
    end: 2,
    split: true,
  });
});

test("trailing alphas", t => {
  t.deepEqual(alpha("a", " abc", { start: 1 }), {
    type: "ident",
    value: "abc",
    end: 4,
    split: true,
  });
});

test("known ident maps", t => {
  t.deepEqual(alpha("p", "pi", { start: 0 }), {
    type: "ident",
    value: "π",
    end: 2,
  });
});

test("known ident greedy", t => {
  t.deepEqual(alpha("s", "sinh", { start: 0 }), {
    type: "ident",
    value: "sinh",
    end: 4,
  });
});

test("substrings are not known idents", t => {
  t.deepEqual(alpha("s", "sinfoo", { start: 0 }), {
    type: "ident",
    value: "sinfoo",
    end: 6,
    split: true,
  });
});

test("known ident with symbol", t => {
  t.deepEqual(alpha("O", "O/", { start: 0 }), {
    type: "ident",
    value: "∅",
    end: 2,
  });
});

test("known ident with symbol cannot be followed with an alphanum", t => {
  t.deepEqual(alpha("O", "O/1", { start: 0 }), {
    type: "ident",
    value: "O",
    end: 1,
    split: true,
  });
});

test("known operators", t => {
  t.deepEqual(alpha("n", "not", { start: 0 }), {
    type: "operator",
    value: "¬",
    end: 3,
  });
});

test("known operator with symbol", t => {
  t.deepEqual(alpha("o", "o+", { start: 0 }), {
    type: "operator",
    value: "⊕",
    end: 2,
  });
});

test("known operator with symbol cannot be followed by an alphanum", t => {
  t.deepEqual(alpha("o", "o+o", { start: 0 }), {
    type: "ident",
    value: "o",
    end: 1,
    split: true,
  });
});
