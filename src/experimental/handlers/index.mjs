import infix from "./infix.mjs";
import group from "./group.mjs";
import prefix from "./prefix.mjs";
import space from "./space.mjs";

const literal = type => ({ start, tokens }) => ({
  node: {
    type: `${type}Literal`,
    value: tokens[start].value,
  },
  end: start + 1,
});

export default new Map([
  ["ident", literal("Ident")],
  ["number", literal("Number")],
  ["operator", literal("Operator")],
  ["text", literal("Text")],
  ["infix", infix],
  ["paren.open", group],
  ["prefix", prefix],
  ["space", space],
]);
