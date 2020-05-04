import test from "ava";
import mathup from "../src/index.mjs";

const render = (str, options) => mathup(str, options).toString();

test("Column vectors", t => {
  t.snapshot(render("(1;2;3)"));
});

test("Matrices", t => {
  t.snapshot(render("[a, b; c, d]"));
});

test("Matrices with semicolon as a column separator", t => {
  t.snapshot(render("[a; b;; c; d]", { colSep: ";" }));
});

test("Newlines as column separator", t => {
  t.snapshot(render("[a, b\n c, d]"));
});

test("Newlines instead of semicolons (w. `;` as colSep)", t => {
  t.snapshot(render("[a; b\n c; d]", { colSep: ";" }));
});

test("Trailing row brakes", t => {
  t.snapshot(render("[1, 2, 3;]"));
});

test("Vertical bar delimited matrices", t => {
  t.snapshot(render("|(a,b,c; d,e,f; h,i,j)|"));
});

test("Double vertical bar delimited matrices", t => {
  t.snapshot(render("||( a; b; c )||"));
});

test("The general n×m matrix", t => {
  t.snapshot(
    render(
      `A = [a_(1 1), a_(1 2), cdots, a_(1 n)
            a_(2 1), a_(2 2), cdots, a_(2 n)
            vdots,   vdots,   ddots, vdots
            a_(m 1), a_(m 2), cdots, a_(m n)]`,
    ),
  );
});

test("Nested matrices", t => {
  t.snapshot(render("[(a, b; d, e), -1; 1, (f, g; h, i)]"));
});

test("Single colomn vector", t => {
  t.snapshot(render("(a; b)"));
});

test("Single row matrix", t => {
  t.snapshot(render("(a, b;)"));
});

test("The absolute value", t => {
  t.snapshot(render("|x| = { x\\,, if x >= 0;  -x\\,, if x < 0"));
});

test("Factorial", t => {
  t.snapshot(render("n! = { 1, if n<=1;  n(n-1)!, otherwise"));
});
