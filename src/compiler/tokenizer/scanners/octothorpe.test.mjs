import test from "ava";
import octothorpe from "./octothorpe.mjs";

test("rejects non-octothorpe", (t) => {
  t.is(octothorpe("a", "a #b c", { start: 0 }), null);
});

test("single char", (t) => {
  t.deepEqual(octothorpe("#", "a #b c", { start: 2 }), {
    type: "number",
    value: "b",
    end: 4,
  });
});

test("multi chars", (t) => {
  t.deepEqual(octothorpe("#", "a #bcd e", { start: 2 }), {
    type: "number",
    value: "bcd",
    end: 6,
  });
});

test("multi chars trailing", (t) => {
  t.deepEqual(octothorpe("#", "a #bcd", { start: 2 }), {
    type: "number",
    value: "bcd",
    end: 6,
  });
});

test("fenced", (t) => {
  t.deepEqual(octothorpe("#", "#`#a bc`", { start: 0 }), {
    type: "number",
    value: "#a bc",
    end: 8,
  });
});

test("fenced no-close", (t) => {
  t.deepEqual(octothorpe("#", "#`forty two", { start: 0 }), {
    type: "number",
    value: "forty two",
    end: 11,
  });
});

test("fenced with inner backtics", (t) => {
  t.deepEqual(octothorpe("#", "#`` `42` ``", { start: 0 }), {
    type: "number",
    value: "`42`",
    end: 11,
  });
});
