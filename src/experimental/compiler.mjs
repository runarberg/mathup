import createTokenizer from "./tokenizer/create-tokenizer.mjs";

export default function compiler(options, input) {
  const tokenize = createTokenizer(options);
  const tokens = tokenize(input);

  return JSON.stringify([...tokens]);
}
