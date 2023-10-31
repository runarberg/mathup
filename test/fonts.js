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

test("Mathvariants for texts", (t) => {
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

test("Space after the variant label", (t) => {
  t.snapshot(render('rm "abc"'));
  t.snapshot(render('it "abc"'));
  t.snapshot(render('bf "abc"'));
  t.snapshot(render('bb "abc"'));
  t.snapshot(render('cc "abc"'));
  t.snapshot(render('fr "abc"'));
  t.snapshot(render('sf "abc"'));
  t.snapshot(render('tt "abc"'));
});

test("Mathvariants for identifiers", (t) => {
  t.snapshot(render("rm`abc`"));
  t.snapshot(render("it`abc`"));
  t.snapshot(render("bf`abc`"));
  t.snapshot(render("bb`abc`"));
  t.snapshot(render("cc`abc`"));
  t.snapshot(render("fr`abc`"));
  t.snapshot(render("sf`abc`"));
  t.snapshot(render("tt`abc`"));
});

test("Mathvariants for identifiers with space after variant", (t) => {
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
