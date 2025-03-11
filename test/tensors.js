import test from "ava";

import mathup from "../src/index.js";

/**
 * @param {string} str
 * @returns {string}
 */
function render(str) {
  return mathup(str).toString();
}

test("pre- and post indices", (t) => {
  t.snapshot(render("(^a_b^c_d)E(^f_g^h_i)"));
});

test("pre- and post tensors", (t) => {
  t.snapshot(render("(_a,^b,_c,^d)E(^f,_g,^h,_i)"));
});

test("remove fences around index", (t) => {
  t.snapshot(render("A(^(a_i))"));
});

test("remove fences around index with trailing space", (t) => {
  t.snapshot(render("A(^(a_i) , (b_i))"));
});

test("leave fences around index with single ident", (t) => {
  t.snapshot(render("A(^(a))"));
});

test("basic tensors", (t) => {
  t.snapshot(render("Gamma(^mu, _nu, _rho)"));
});

test("Carbon 14", (t) => {
  t.snapshot(render("[^14_6]rm C"));
});

test("Permutation multiscripts-notation", (t) => {
  t.snapshot(render("(^n)P(_k)"));
});

test("Generalized Kronecker delta", (t) => {
  t.snapshot(
    render(
      "delta(^\\[ ^(alpha_1)_(beta_1)) ... delta(^(alpha_p)_(beta_p) ^\\])",
    ),
  );
});

test("Einstein notation", (t) => {
  t.snapshot(
    render(
      "(bf it B')(^i,_j) = sum_k sum_l bf it B(^k,_l) delta(^i,l) delta(_k,j)",
    ),
  );
});
