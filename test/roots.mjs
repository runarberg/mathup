import test from "ava";
import mathup from "../src/index.mjs";

const render = (str) => mathup(str).toString();

test("Displays square roots", (t) => {
  t.snapshot(render("sqrt x"));
});

test("Displays n-roots", (t) => {
  t.snapshot(render("root n x"));
});

test("Omits brackets in roots", (t) => {
  t.snapshot(render("sqrt(2)"));
  t.snapshot(render("root(3, 2)"));
});

test("Allows empty roots", (t) => {
  t.snapshot(render("sqrt"));
  t.snapshot(render("root  "));
  t.snapshot(render("root 3 "));
});

test("sqrt(2) ≈ 1.414", (t) => {
  t.snapshot(render("sqrt 2 ~~ 1.414213562"));
});

test("Quadradic formula", (t) => {
  t.snapshot(render("x = (-b +- sqrt(b^2 - 4ac)) / 2a"));
});

test("Golden ratio (algebraic form)", (t) => {
  t.snapshot(render("phi = (1 + sqrt 5)/2"));
});

test("Plastic number", (t) => {
  t.snapshot(
    render("rho = (root(3, 108 + 12 sqrt 69) + root(3, 108 - 12 sqrt 69)) / 6"),
  );
});

test("Continued square root", (t) => {
  t.snapshot(
    render(
      "sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + cdots)))))))",
    ),
  );
});
