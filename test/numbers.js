import test from "ava";
import mathup from "../src/index.js";

/**
 * @param {string} str
 * @param {import("../src/index.js").Options} [options]
 * @returns {string}
 */
function render(str, options) {
  return mathup(str, options).toString();
}

test("Unicode numerals", (t) => {
  t.snapshot(render("٣٫١٤١٥٩٢٦٥", { decimalMark: "٫" }));
});

test("Numbers with #`...`", (t) => {
  t.snapshot(render("#0x2A"));
  t.snapshot(render("#XLII"));
});

test("Duodecimals", (t) => {
  t.snapshot(render("1/2 + 1/3 = 5/6 = 0.↊, 2/3 + 1/4 = ↋/10 = 0.↋"));
});

test("al-Khwarizmi", (t) => {
  t.snapshot(render("(١٠ - ح)^٢ = ٨١ح"));
});

test("Hex to RGB", (t) => {
  t.snapshot(render("#`#3094AB` == `rgb`(48, 148, 171)"));
  t.snapshot(render("`rgb`(48, 148, 171) == #`#3094AB`"));
});

test("Forty two", (t) => {
  t.snapshot(render("#0x2A = #XLII = #`4.2e+01` = #`forty two` = 42"));
});
