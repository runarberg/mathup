import { handlePrefixed } from "./utils.mjs";

export default function(char, input, { start }) {
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
