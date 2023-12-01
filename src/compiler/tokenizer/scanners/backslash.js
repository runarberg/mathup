import { handlePrefixed } from "./utils.js";

/** @type {import("./index.js").Scanner} */
export default function backslashScanner(char, input, { start }) {
  if (char !== "\\") {
    return null;
  }

  return {
    type: "operator",
    ...handlePrefixed("\\", start, input),
  };
}
