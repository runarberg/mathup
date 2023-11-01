import { handleQuote } from "./utils.js";

/**
 * @type {import("./index.js").Scanner}
 */
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
