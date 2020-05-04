import test from "ava";
import space from "./space.mjs";

test("rejects non-space", (t) => {
  t.is(space("a", "a b", { start: 0 }), null);
});

test("single space", (t) => {
  t.deepEqual(space(" ", "a b", { start: 1 }), {
    type: "space",
    value: " ",
    end: 2,
  });
});

test("subsequent spaces", (t) => {
  t.deepEqual(space(" ", "a   b", { start: 1 }), {
    type: "space",
    value: "   ",
    end: 4,
  });
});

test("trailing spaces", (t) => {
  t.deepEqual(space(" ", "a  ", { start: 1 }), {
    type: "space",
    value: "  ",
    end: 3,
  });
});
