import test from "ava";
import mathup from "../src/index.js";

const render = (str, options) => mathup(str, options).toString();

test("Display block, when passed in", (t) => {
  t.snapshot(render("", { display: "block" }));
});

test("right-to-left direction when passed in", (t) => {
  t.snapshot(render("", { dir: "rtl" }));
});

test("Should be able to be both at the same time", (t) => {
  t.snapshot(render("", { display: "block", dir: "rtl" }));
});

test("Comma as a decimal mark", (t) => {
  const options = { decimalMark: "," };

  t.snapshot(render("40,2", options));
  t.snapshot(render("40,2/13,3", options));
  t.snapshot(render("2^0,5", options));
});

test('Column separators default to ";" when decimal marks are ","', (t) => {
  const options = { decimalMark: "," };

  t.snapshot(render("(1; 2; 3,14)", options));
});

test('Row separators default to ";;" when column separators are ";"', (t) => {
  t.snapshot(render("[1 ;; 2 ;; 3.14]", { colSep: ";" }));
  t.snapshot(render("[1 ;; 2 ;; 3,14]", { decimalMark: "," }));
});

test("Arbitrary column separators", (t) => {
  t.snapshot(render("(1 | 2 | 3.14)", { colSep: "|" }));
  t.snapshot(render("(1 ; 2 ; 3,14)", { colSep: ";", decimalMark: "," }));
});

test("Arbitrary row separators", (t) => {
  t.snapshot(render("(1 & 2 & 3.14)", { rowSep: "&" }));
  t.snapshot(render("(1 ;; 2 ;; 3,14)", { rowSep: ";;", decimalMark: "," }));
});
