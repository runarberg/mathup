import { handleQuote } from "./utils.mjs";

export default function quoteScanner(char, input, { start }) {
  if (char !== '"') {
    return null;
  }

  const { end, value } = handleQuote(start, input);

  return {
    type: "text",
    value,
    end,
  };
}
