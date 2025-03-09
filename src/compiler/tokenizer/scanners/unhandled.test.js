import test from "ava";

import unhandled from "./unhandled.js";

test("unhandled is an ident", (t) => {
  const token = unhandled(" ", " input", { start: 0, grouping: false });

  t.deepEqual(token, {
    type: "ident",
    value: " ",
    end: 1,
  });
});
