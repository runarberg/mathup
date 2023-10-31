import test from "ava";
import tokenizer from "./index.js";

const options = {
  decimalMark: ".",
  colSep: ",",
  rowSep: ";",
};

test("infix", (t) => {
  const tokenize = tokenizer(options);

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

test("infix modified", (t) => {
  const tokenize = tokenizer(options);

  t.deepEqual(
    [...tokenize("a._b // 2.^3")],
    [
      { type: "ident", value: "a" },
      { type: "infix", value: "under" },
      { type: "ident", value: "b" },
      { type: "space", value: " " },
      { type: "operator", value: "⁄", attrs: undefined },
      { type: "space", value: " " },
      { type: "number", value: "2" },
      { type: "infix", value: "over" },
      { type: "number", value: "3" },
    ],
  );
});

test("operators", (t) => {
  const tokenize = tokenizer(options);

  t.deepEqual(
    [...tokenize("* ** *** .. ...")],
    [
      { type: "operator", value: "·", attrs: undefined },
      { type: "space", value: " " },
      { type: "operator", value: "∗", attrs: undefined },
      { type: "space", value: " " },
      { type: "operator", value: "⋆", attrs: undefined },
      { type: "space", value: " " },
      { type: "operator", value: "." },
      { type: "operator", value: "." },
      { type: "space", value: " " },
      { type: "operator", value: "…", attrs: undefined },
    ],
  );
});
