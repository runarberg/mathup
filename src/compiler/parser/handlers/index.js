import infix from "./infix.js";
import group from "./group.js";
import prefix from "./prefix.js";
import space from "./space.js";

const literal =
  (type) =>
  ({ start, tokens }) => {
    const { value, attrs } = tokens[start];

    return {
      node: {
        type: `${type}Literal`,
        value,
        attrs,
      },
      end: start + 1,
    };
  };

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
