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
  t.snapshot(render("1+2/3+4"));
  t.snapshot(render("1+2 /3+4"));
  t.snapshot(render("1+2/ 3+4"));
  t.snapshot(render("1+2 / 3+4"));
  t.snapshot(render("1 + 2/3 + 4"));
  t.snapshot(render("1 + 2 / 3 + 4"));
});

test("Golden ratio (continued fraction)", t => {
  t.snapshot(render("phi = 1+1/ 1+1/ 1+1/ 1+1/ 1+ddots"));
});

test("Normal distribution", t => {
  t.snapshot(
    render(
      "cc N (x | mu, sigma^2) = 1 / (sigma sqrt(2pi)) e ^ -1/2(x-mu / sigma)^2",
    ),
  );
});
