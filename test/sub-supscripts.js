import test from "ava";
import mathup from "../src/index.mjs";

const render = str => mathup(str).toString();

test("Displays subscripts", t => {
  t.snapshot(render("a_i"));
});

test("Displays superscripts", t => {
  t.snapshot(render("a^2"));
});

test("Displays sub-superscripts", t => {
  t.snapshot(render("a_i^2"));
});

test("Renders sub-superscripts in either direction", t => {
  t.snapshot(render("a^2_i"));
});

test("Allows trailing sub or superscripts", t => {
  t.snapshot(render("a^"));
  t.snapshot(render("b_  "));
});

test("Allows trailing sub-supscript", t => {
  t.snapshot(render("a_i^"));
  t.snapshot(render("a^2_"));
});

test("Should not treat `^^` as superscript", t => {
  t.snapshot(render("a^^2"));
});

test("Should not treat `__` or `_|` as subscript", t => {
  t.snapshot(render("a_|_i"));
  t.snapshot(render("|__a__| i"));
});

test("Pythagorean theorem", t => {
  t.snapshot(render("a^2 + b^2 = c^2"));
});

test("Matrix transpose", t => {
  t.snapshot(render("(X^T)_ij = X_ji"));
});

test("The natural logarithm", t => {
  t.snapshot(render("ln x = int_1^x 1/t dt"));
});

test("Powers of powers of two", t => {
  t.snapshot(render("2^2^2^2"));
});
