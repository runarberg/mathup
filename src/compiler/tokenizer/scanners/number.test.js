import test from "ava";
import number from "./number.js";

const options = {
  decimalMark: ".",
  colSep: ",",
  rowSep: ";",
};

test("rejects non-numeric", (t) => {
  t.is(number("a", "a1", { start: 0, grouping: false }, options), null);
});

test("single digit", (t) => {
  t.deepEqual(number("5", "5a", { start: 0, grouping: false }, options), {
    type: "number",
    value: "5",
    end: 1,
  });
});

test("multi digit", (t) => {
  t.deepEqual(number("4", "42", { start: 0, grouping: false }, options), {
    type: "number",
    value: "42",
    end: 2,
  });
});

test("decimal mark", (t) => {
  t.deepEqual(number("3", "3.14", { start: 0, grouping: false }, options), {
    type: "number",
    value: "3.14",
    end: 4,
  });
});

test("custom decimal mark", (t) => {
  t.deepEqual(
    number(
      "3",
      "3,14",
      { start: 0, grouping: false },
      { decimalMark: ",", colSep: ",", rowSep: ";" },
    ),
    {
      type: "number",
      value: "3,14",
      end: 4,
    },
  );
});

test("trailing decimal mark not a number", (t) => {
  t.deepEqual(number("3", "3.", { start: 0, grouping: false }, options), {
    type: "number",
    value: "3",
    end: 1,
  });
});

test("double decimal mark – only first portion is a number", (t) => {
  t.deepEqual(number("3", "3.14.15", { start: 0, grouping: false }, options), {
    type: "number",
    value: "3.14",
    end: 4,
  });
});

test("leading decimal mark not a number", (t) => {
  t.is(number(".", ".1", { start: 0, grouping: false }, options), null);
});
