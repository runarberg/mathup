import createTokenizer from "./tokenizer/create-tokenizer.mjs";
import parse from "./parser.mjs";

export default function compiler(options, input) {
  const tokenize = createTokenizer(options);
  const tokens = tokenize(input);
  const ast = parse([...tokens]);

  return JSON.stringify(ast);
}
