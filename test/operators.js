import test from "ava";
import mathup from "../src/index.mjs";

const render = str => mathup(str).toString();

test("Force operators with \\", t => {
  t.is(render("\\^"), "<math><mo>^</mo></math>");
  t.is(render("\\\\"), "<math><mo>\\</mo></math>");
});

test("Force long operator with \\`op` and \\`` `op` ``]", t => {
  t.snapshot(render("\\(`"));
  t.snapshot(render("\\`foo bar` \\`` ` ``"));
  t.snapshot(render("\\`(1)`"));
});

test("Only force an operator when \\ precedes a character", t => {
  t.snapshot(render("\\"));
});

test("i hat", t => {
  t.snapshot(render("ı.^\\^"));
});

test("The operator (n) as an overscript", t => {
  t.snapshot(render("x.^ \\`(n)`"));
});

test("Sums", t => {
  t.snapshot(render("sum_(n=0)^k a_n = a_0 + a_i + cdots + a_k"));
});

test("Function composition", t => {
  t.snapshot(render("bf F @ bf G  :  U sube RR^3 -> RR^2"));
});

test("Eulers number", t => {
  t.snapshot(render("e = sum_(n=0)^oo 1 / n!"));
});

test("Remove space around derivatives", t => {
  t.snapshot(render("f'(x)"));
  t.snapshot(render("f''(x)"));
  t.snapshot(render("f'''(x)"));
  t.snapshot(render("f''''(x)"));
});

test("Bayes theorem", t => {
  t.snapshot(render("p(a | b) = (p(b | a)p(a)) / p(b)"));
});

test("Gradient", t => {
  t.snapshot(
    render("grad f(x,y) = ((del f)/(del x) (x, y), (del f)/(del y) (x,y))"),
  );
});

test("Taylor polynomial", t => {
  t.snapshot(
    render(
      "P_k(x) = f(a) + f'(a)(x-a) + f''(a) / 2! (x-a)^2 + cdots + f^(k)(a) / k! (x-a)^k",
    ),
  );
});

test("Strokes theorem", t => {
  t.snapshot(
    render("oint_(del S) bf F * d bf S = dint_S grad xx bf F * d bf s"),
  );
});
