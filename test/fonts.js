import test from "ava";

import mathup from "../src/index.js";

/**
 * @param {string} str
 * @returns {string}
 */
function render(str) {
  return mathup(str).toString();
}

test("Double quoted as text", (t) => {
  t.snapshot(render('"alpha"'));
});

test("Backtick surrounded as identifiers", (t) => {
  t.snapshot(render("`1`"));
  t.snapshot(render("`Gamma` != Gamma"));
});

test("fonts and style commands on texts", (t) => {
  t.snapshot(render('rm"abc"'));
  t.snapshot(render('it"abc"'));
  t.snapshot(render('bf"abc"'));
  t.snapshot(render('bb"abc"'));
  t.snapshot(render('cc"abc"'));
  t.snapshot(render('fr"abc"'));
  t.snapshot(render('sf"abc"'));
  t.snapshot(render('tt"abc"'));
});

test("Double-struck characters", (t) => {
  t.snapshot(render('bb"0123456789"'));
  t.snapshot(render('bb"abcdefghijklmnopqrstuvwxyz"'));
  t.snapshot(render('bb"ABCDEFGHIJKLMNOPQRSTUVWXYZ"'));
  t.snapshot(render('bb"R"'));
  t.snapshot(render('bb"1-R.ℤ"'));
});

test("Space after the command label", (t) => {
  t.snapshot(render('rm "abc"'));
  t.snapshot(render('it "abc"'));
  t.snapshot(render('bf "abc"'));
  t.snapshot(render('bb "abc"'));
  t.snapshot(render('cc "abc"'));
  t.snapshot(render('fr "abc"'));
  t.snapshot(render('sf "abc"'));
  t.snapshot(render('tt "abc"'));
});

test("stacked commands on text", (t) => {
  t.snapshot(render('bf it "abc"'));
  t.snapshot(render('it bf "abc"'));
  t.snapshot(render('sf it bf "abc"'));
  t.snapshot(render('bf fr "abc"'));
});

test("text-transforms for identifiers", (t) => {
  t.snapshot(render("rm`abc`"));
  t.snapshot(render("it`abc`"));
  t.snapshot(render("bf`abc`"));
  t.snapshot(render("bb`abc`"));
  t.snapshot(render("cc`abc`"));
  t.snapshot(render("fr`abc`"));
  t.snapshot(render("sf`abc`"));
  t.snapshot(render("tt`abc`"));
});

test("mathvariant normal", (t) => {
  t.snapshot(render("rm i"));
  t.snapshot(render("rm Γ"));
});

test("text-transforms for identifiers with space after variant", (t) => {
  t.snapshot(render("rm `abc`"));
  t.snapshot(render("it `abc`"));
  t.snapshot(render("bf `abc`"));
  t.snapshot(render("bb `abc`"));
  t.snapshot(render("cc `abc`"));
  t.snapshot(render("fr `abc`"));
  t.snapshot(render("sf `abc`"));
  t.snapshot(render("tt `abc`"));
});

test("stacked text-transforms for identifiers", (t) => {
  t.snapshot(render("rm `abc`"));
  t.snapshot(render("it `abc`"));
  t.snapshot(render("bf `abc`"));
  t.snapshot(render("bb `abc`"));
  t.snapshot(render("cc `abc`"));
  t.snapshot(render("fr `abc`"));
  t.snapshot(render("sf `abc`"));
  t.snapshot(render("tt `abc`"));
});

test("Mathvariants for terms", (t) => {
  t.snapshot(render("bb 1+1"));
});

test("Mathvariants for fenced groups", (t) => {
  t.snapshot(render("bb (A, B)"));
});

test("Mathvariants for matrices", (t) => {
  t.snapshot(render("bf [a; b]"));
});

test("Mathvariants for subscripts", (t) => {
  t.snapshot(render("bf a_i"));
});

test("Mathvariants for superscripts", (t) => {
  t.snapshot(render("bf a^2"));
});

test("Mathvariants for sub-superscripts", (t) => {
  t.snapshot(render("bf a_i^2"));
});

test("Ignore if no opperant", (t) => {
  t.snapshot(render("X_ it"));
  t.snapshot(render("X_(it)"));
  t.snapshot(render("X_{:it:}"));
});

test("Font inside a magnitude of a vector", (t) => {
  t.snapshot(render("|vec bf a|"));
  t.snapshot(render("|bf vec a|"));
});
