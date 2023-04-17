import test from "ava";
import mathup from "../src/index.js";

const render = (str) => mathup(str).toString();

test("Greeks (uppercase in normal variant, lowercase in italic)", (t) => {
  t.snapshot(render("Gamma Delta Theta Lambda Xi Pi Sigma Phi Psi Omega"));
  t.snapshot(
    render(
      "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi pi rho sigma tau upsilon phi chi psi omega",
    ),
  );
});

test("Special", (t) => {
  t.snapshot(render("oo O/"));
});

test("Blackboard", (t) => {
  t.snapshot(render("NN ZZ QQ RR CC"));
});

test("Should force identifiers with (`)", (t) => {
  t.snapshot(render("`int`"));
});
