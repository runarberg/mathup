import tokenizer from "./tokenizer/index.mjs";
import parse from "./parser/parse.mjs";
import toDOM from "./renders/to-dom.mjs";
import toString from "./renders/to-string.mjs";
import transformer from "./transformer/index.mjs";
import updateDOM from "./renders/update-dom.mjs";

export default function compiler(options) {
  return function compile(input) {
    const tokenize = tokenizer(options);
    const tokens = tokenize(input);
    const ast = parse([...tokens]);
    const transform = transformer(options);
    const domTree = transform(ast);

    return {
      ast,
      domTree,

      toDOM() {
        return toDOM(domTree, options);
      },

      toString() {
        return toString(domTree, options);
      },

      updateDOM(root) {
        return updateDOM(root, domTree, options);
      },
    };
  };
}
