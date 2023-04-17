import { handlePrefixed } from "./utils.js";

export default function octothorpeScanner(char, input, { start }) {
  if (char !== "#") {
    return null;
  }

  const { end, value } = handlePrefixed("#", start, input);

  return {
    type: "number",
    value,
    end,
  };
}
