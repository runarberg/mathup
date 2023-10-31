import test from "ava";
import mathup from "../src/index.js";

/**
 * @param {string} str
 * @returns {string}
 */
function render(str) {
  return mathup(str).toString();
}

test("Should wrap all expressions in <math>", (t) => {
  t.snapshot(render(""));
});

test("Should wrap numbers in <mn>", (t) => {
  t.snapshot(render("42"));
});

test("Should wrap decimals in <mn>", (t) => {
  t.snapshot(render("3.141592654"));
});

test("Should wrap identifiers in <mi>", (t) => {
  t.snapshot(render("x"));
  t.snapshot(render("y"));
  t.snapshot(render("a"));
  t.snapshot(render("ni"));
});

test("Should wrap operatos in <mo>", (t) => {
  t.snapshot(render("+"));
  t.snapshot(render("-"));
});

test("1+1 = 2", (t) => {
  t.snapshot(render("1+1 = 2"));
});

test("3-2 = 1", (t) => {
  t.snapshot(render("3-2 = 1"));
});
