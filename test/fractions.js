import test from "ava";
import mathup from "../src/index.mjs";

const render = str => mathup(str).toString();

test("Displays fractions", t => {
  t.snapshot(render("a/b"));
});

test("Does not parse `//` as fraction", t => {
  t.snapshot(render("a//b"));
});

test("Omits brackets around numerator or denominator", t => {
  t.snapshot(render("(a+b)/(c+d)"));
});

test("Allows trailing fractions", t => {
  t.snapshot(render("a/"));
  t.snapshot(render("b / "));
});

test("Significant whitespace in fractions", t => {
  t.snapshot(render("1+3 / 2+2"));
  t.snapshot(render("1 + 3/2 + 2"));
  t.snapshot(render("a/b / c/d"));
});

test("Golden ratio (continued fraction)", t => {
  t.snapshot(render("phi = 1 + 1/(1 + 1/(1 + 1/(1 + 1/(1 + ddots))))"));
});

test("Normal distribution", t => {
  t.snapshot(
    render(
      "cc N (x | mu, sigma^2) = 1/sqrt(2pi sigma^2) e^-((x-mu)^2 / 2sigma^2)",
    ),
  );
});
