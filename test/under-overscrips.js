import test from "ava";

import mathup from "../src/index.js";

/**
 * @param {string} str
 * @returns {string}
 */
function render(str) {
  return mathup(str).toString();
}

test("Displays underscripts", (t) => {
  t.snapshot(render("X._a"));
});

test("Displays overscripts", (t) => {
  t.snapshot(render("X.^a"));
});

test("Displays under-overscripts", (t) => {
  t.snapshot(render("X.^a._b"));
});

test("Allows trailing under or overscripts", (t) => {
  t.snapshot(render("a.^"));
  t.snapshot(render("b._  "));
});

test("Allows trailing under-overscript", (t) => {
  t.notThrows(() => render("a._i .^"));
  t.notThrows(() => render("a._i .^"));
  t.notThrows(() => render("a._i  ^"));
  t.notThrows(() => render("a.^2._"));
  t.notThrows(() => render("a.^2_ "));
});

test("Goes under limits", (t) => {
  t.snapshot(render("lim_ a->b"));
});

test("Goes over and under sums", (t) => {
  t.snapshot(render("sum_(i=0)^n"));

  t.snapshot(render("sum^n_(i=0)"));
});

test("Goes over and under products", (t) => {
  t.snapshot(render("prod_(i=1)^n"));
  t.snapshot(render("prod^n_(i=1)"));
});

test("Golden ratio (defenition)", (t) => {
  t.snapshot(render('phi =.^"def" a/b = (a+b)/a'));
});

test("Matrix dimentions", (t) => {
  t.snapshot(render("X._(n xx m)"));
});

test("k times x", (t) => {
  t.snapshot(render('{: x + ... + x :}.^⏞.^(k  "times")'));
  t.snapshot(render('obrace(x+...+x).^(k  "times")'));
});
