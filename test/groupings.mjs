import test from "ava";
import mathup from "../src/index.mjs";

const render = (str) => mathup(str).toString();

test("Groups brackets together", (t) => {
  t.snapshot(render("(a+b)"));
});

test("Handles comma seperated lists", (t) => {
  t.snapshot(render("a,b,c"));
});

test("Adds parentesis around parentesized comma seperated lists", (t) => {
  t.snapshot(render("(a,b,c)"));
});

test("Allows unclosed fences", (t) => {
  t.snapshot(render("(a"));
  t.snapshot(render("((a)"));
  t.snapshot(render("[("));
});

test("Complex groupings", (t) => {
  t.snapshot(render("abs(x)"));
  t.snapshot(render("floor(x)"));
  t.snapshot(render("ceil(x)"));
  t.snapshot(render("norm(x)"));
  t.snapshot(render("abs x"));
  t.snapshot(render("floor x"));
  t.snapshot(render("ceil x"));
  t.snapshot(render("norm x"));
});

test("Binom function", (t) => {
  t.snapshot(render("binom(n, k)"));
  t.snapshot(render("binom n k"));
});

test("Binom function accepts expressions", (t) => {
  t.snapshot(render("binom(a, b + c)"));
  t.snapshot(render("binom a b+c"));
});

test("Missing argument in the binom function", (t) => {
  t.snapshot(render("binom(a,)"));
  t.snapshot(render("binom(,b)"));
});

test("Simplify polynomials", (t) => {
  t.snapshot(render("(x+y)(x-y) = x^2 - y^2"));
});

test("Exponential decay", (t) => {
  t.snapshot(render("e^ -x"));
});

test("Eulers identity", (t) => {
  t.snapshot(render("e^(i tau) = 1"));
});

test("The natural numbers", (t) => {
  t.snapshot(render("NN = {1, 2, 3, ...}"));
});

test("Average over time", (t) => {
  t.snapshot(
    render("(: V(t)^2 :) = lim_ T->oo 1/T int_(-T/2)^(T/2) V(t)^2 dt"),
  );
});

test("The binomial coefficient", (t) => {
  t.snapshot(render("binom(n, k) = n! / (n-k)!k!"));
});
