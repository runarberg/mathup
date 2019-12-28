import { handleQuote } from "./utils.mjs";

export default function quote(char, input, { start }) {
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
