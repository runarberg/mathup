import tokenizer from "./tokenizer/index.js";
import parse from "./parser/parse.js";
import toDOM from "./renders/to-dom.js";
import toString from "./renders/to-string.js";
import transformer from "./transformer/index.js";
import updateDOM from "./renders/update-dom.js";

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
