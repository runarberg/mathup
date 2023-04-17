import test from "ava";
import groupSep from "./group-sep.js";

test("rejects non-group-sep", (t) => {
  t.is(groupSep("a", "(a,b)", { start: 1, grouping: true }), null);
});

test("rejects group-sep in non-grouping context", (t) => {
  t.is(groupSep(",", "(a,b)", { start: 2, grouping: false }), null);
  t.is(groupSep(";", "(a;b)", { start: 2, grouping: false }), null);
});

test("simple col-sep", (t) => {
  t.deepEqual(groupSep(",", "(a,b)", { start: 2, grouping: true }), {
    type: "sep.col",
    value: ",",
    end: 3,
  });
});

test("simple row-sep", (t) => {
  t.deepEqual(groupSep(";", "(a;b)", { start: 2, grouping: true }), {
    type: "sep.row",
    value: ";",
    end: 3,
  });
});

test("custom col-sep", (t) => {
  t.deepEqual(
    groupSep(
      ";",
      "(3.14; 2.72)",
      { start: 5, grouping: true },
      { colSep: ";", rowSep: ";;" },
    ),
    {
      type: "sep.col",
      value: ";",
      end: 6,
    },
  );
});

test("custom row-sep", (t) => {
  t.deepEqual(
    groupSep(
      ";",
      "(3.14 ;; 2.72)",
      { start: 6, grouping: true },
      { colSep: ";", rowSep: ";;" },
    ),
    {
      type: "sep.row",
      value: ";;",
      end: 8,
    },
  );
});
