import expr from "./handlers/expr.js";

export default function parse(tokens) {
  const body = [];
  let pos = 0;

  while (pos < tokens.length) {
    const state = {
      tokens,
      start: pos,
      stack: body,
    };

    const next = expr(state);

    pos = next.end;
    body.push(next.node);
  }

  return {
    type: "Sentence",
    body,
  };
}
