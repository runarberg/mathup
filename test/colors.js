import test from "ava";

import mathup from "../src/index.js";

/**
 * @param {string} str
 * @returns {string}
 */
function render(str) {
  return mathup(str).toString();
}

test("Basic colors", (t) => {
  t.snapshot(render("gray a"));
  t.snapshot(render("\u{1f7e0}A"));
  t.snapshot(render("red 1+1"));
  t.snapshot(render("yellow abc"));
});

test("Color groups", (t) => {
  t.snapshot(render("blue (a, b, c)"));
  t.snapshot(render("green norm b"));
});

test("Colors with fonts", (t) => {
  t.snapshot(render("purple bf a"));
  t.snapshot(render("bf purple a"));
  t.snapshot(render("\u{1f7e3}bf a"));
  t.snapshot(render("bf\u{1f7e3}a"));
});

test("Backgrounds", (t) => {
  t.snapshot(render("bg.gray a"));
  t.snapshot(render("bg.red 1+1"));
  t.snapshot(render("\u{1f7e5}1+1"));
  t.snapshot(render("bg.yellow abc"));
});

test("Background groups", (t) => {
  t.snapshot(render("bg.blue (a, b, c)"));
  t.snapshot(render("bg.green norm b"));
});

test("Background with fonts", (t) => {
  t.snapshot(render("bg.purple bf a"));
  t.snapshot(render("bf bg.purple a"));
});

test("Color and background", (t) => {
  t.snapshot(render("bg.black white a"));
  t.snapshot(render("white bg.black a"));
});

test("Color and background and font", (t) => {
  t.snapshot(render("bg.black white bf a"));
  t.snapshot(render("bg.black bf white a"));
});

test("Color and background and font with emoji", (t) => {
  t.snapshot(render("\u{2b1b}\u{26aa}bf a"));
  t.snapshot(render("\u{2b1b}bf\u{26aa}a"));
});

test("Cancel and color", (t) => {
  t.snapshot(render("cancel red a"));
  t.snapshot(render("bf red cancel a"));
});

test("Cancel and background", (t) => {
  t.snapshot(render("cancel bg.red a"));
  t.snapshot(render("bf bg.red cancel a"));
});
