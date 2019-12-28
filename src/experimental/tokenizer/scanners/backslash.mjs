import { handlePrefixed } from "./utils.mjs";

export default function backslash(char, input, { start }) {
  if (char !== "\\") {
    return null;
  }

  const { end, value } = handlePrefixed("\\", start, input);

  return {
    type: "operator",
    value,
    end,
  };
}
