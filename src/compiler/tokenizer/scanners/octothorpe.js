import { handlePrefixed } from "./utils.js";

/** @type {import("./index.js").Scanner} */
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
