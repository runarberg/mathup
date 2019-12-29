import createTokenizer from "./tokenizer/create-tokenizer.mjs";
import parse from "./parser.mjs";
import toDOM from "./renders/to-dom.mjs";
import toString from "./renders/to-string.mjs";
import transformer from "./transformer.mjs";

export default function compiler(options, input) {
  const tokenize = createTokenizer(options);
  const tokens = tokenize(input);
  const ast = parse([...tokens]);
  const transform = transformer(options);
  const domTree = transform(ast);

  return {
    ast,
    domTree,

    toDOM() {
      return toDOM(domTree);
    },

    toString() {
      return toString(domTree);
    },
  };
}
