import test from "ava";
import mathup from "../src/index.js";

const render = (str) => mathup(str).toString();

test("Tangent = Sinus over Cosinus", (t) => {
  t.snapshot(render("tan = sin/cos"));
});

test("The hyperbolic function", (t) => {
  t.snapshot(
    render(
      `{: sinh x = (e^x - e^ -x) / 2 \\,
          cosh x = (e^x + e^ -x) / 2 \\,
          tanh x = (sinh x) / (cosh x) .`,
    ),
  );
});

test("Logarithm change of base", (t) => {
  t.snapshot(render("log_b x = (log_k x)/(log_k b)"));
});

test("Logarithm powers", (t) => {
  t.snapshot(render("ln x^2 = 2 ln x"));
});

test("Logarithm division", (t) => {
  t.snapshot(render("ln x/y = ln x - ln y"));
});

test("2×2 determinants", (t) => {
  t.snapshot(render("det(A) = |(a, b; c, d)| = ad - cd"));
});

test("Fermats little theorem", (t) => {
  t.snapshot(render("a^ p-1 -= 1   (mod p)"));
});
