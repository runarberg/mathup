import test from "ava";
import newline from "./newline.mjs";

test("rejects non-newline", t => {
  t.is(newline("a", "a\nb", { start: 0 }), null);
});

test("single newline", t => {
  t.deepEqual(newline("\n", "a\nb", { start: 1 }), {
    type: "space",
    value: "\n",
    end: 2,
  });
});

test("multi newline", t => {
  t.deepEqual(newline("\n", "a\n\n\nb", { start: 1 }), {
    type: "space",
    value: "\n\n\n",
    end: 4,
  });
});

test("trailing newline", t => {
  t.deepEqual(newline("\n", "a\n\n", { start: 1 }), {
    type: "space",
    value: "\n\n",
    end: 3,
  });
});

test("as row-sep", t => {
  t.deepEqual(newline("\n", "(a\nb)", { start: 3, grouping: true }), {
    type: "sep.row",
    value: "\n",
    end: 4,
  });
});
