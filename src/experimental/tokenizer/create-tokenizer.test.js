import test from "ava";
import createTokenizer from "./create-tokenizer.mjs";

test("infix", t => {
  const tokenize = createTokenizer();

  t.deepEqual(
    [...tokenize("a_b / 2^3")],
    [
      { type: "ident", value: "a" },
      { type: "infix", value: "sub" },
      { type: "ident", value: "b" },
      { type: "space", value: " " },
      { type: "infix", value: "frac" },
      { type: "space", value: " " },
      { type: "number", value: "2" },
      { type: "infix", value: "sup" },
      { type: "number", value: "3" },
    ],
  );
});

test("infix modified", t => {
  const tokenize = createTokenizer();

  t.deepEqual(
    [...tokenize("a._b // 2.^3")],
    [
      { type: "ident", value: "a" },
      { type: "infix", value: "under" },
      { type: "ident", value: "b" },
      { type: "space", value: " " },
      { type: "operator", value: "⁄" },
      { type: "space", value: " " },
      { type: "number", value: "2" },
      { type: "infix", value: "over" },
      { type: "number", value: "3" },
    ],
  );
});

test("operators", t => {
  const tokenize = createTokenizer();

  t.deepEqual(
    [...tokenize("* ** *** .. ...")],
    [
      { type: "operator", value: "·" },
      { type: "space", value: " " },
      { type: "operator", value: "∗" },
      { type: "space", value: " " },
      { type: "operator", value: "⋆" },
      { type: "space", value: " " },
      { type: "operator", value: "." },
      { type: "operator", value: "." },
      { type: "space", value: " " },
      { type: "operator", value: "…" },
    ],
  );
});
