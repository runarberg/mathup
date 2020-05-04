import test from "ava";
import mathup from "../src/index.mjs";

const render = (str) => mathup(str).toString();

test("More then one subsequent whitespace keeps", (t) => {
  t.snapshot(render("a  b"));
  t.snapshot(render("a b"));
});

test("One whitespace char truncates", (t) => {
  t.snapshot(render("a b"));
});

test("Whitespace count follows the equation `n-1 ex`", (t) => {
  t.snapshot(render("a  b"));
  t.snapshot(render("a   b"));
  t.snapshot(render(`a${" ".repeat(20)}b`));
});

test("Adjacent symbols on either side of whitespace gets wrapped in an <mrow>", (t) => {
  t.snapshot(render("ab cd"));
});
