import test from "ava";

import { applyStyles } from "./styles.js";

test("applyStyles sets the style with custom properties", (t) => {
  const styles = new Map([
    ["color", "white"],
    ["background", "red"],
  ]);
  const tag = {
    tag: "mrow",
  };

  t.deepEqual(applyStyles(styles, tag), {
    tag: "mrow",
    attrs: {
      style:
        "color:var(--mathup-color-white, white);background:var(--mathup-background-red, red);",
    },
  });
});

test("applyStyles overrides colors", (t) => {
  const styles = new Map([
    ["color", "white"],
    ["color", "red"],
  ]);
  const tag = {
    tag: "mrow",
  };

  t.deepEqual(applyStyles(styles, tag), {
    tag: "mrow",
    attrs: {
      style: "color:var(--mathup-color-red, red);",
    },
  });
});

test("applyStyles overrides backgrounds", (t) => {
  const styles = new Map([
    ["background", "white"],
    ["background", "red"],
  ]);
  const tag = {
    tag: "mrow",
  };

  t.deepEqual(applyStyles(styles, tag), {
    tag: "mrow",
    attrs: {
      style: "background:var(--mathup-background-red, red);",
    },
  });
});

test("applyStyles conserves existing attrs", (t) => {
  const styles = new Map([["color", "red"]]);
  const tag = {
    tag: "mrow",
    attrs: { must: "preserve" },
  };

  t.deepEqual(applyStyles(styles, tag), {
    tag: "mrow",
    attrs: {
      must: "preserve",
      style: "color:var(--mathup-color-red, red);",
    },
  });
});
