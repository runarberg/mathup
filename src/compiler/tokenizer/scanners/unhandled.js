import { isMark } from "../lexemes.js";

/**
 * @typedef {import("./index.js").Scanner} Scanner
 * @type { (...args: Parameters<Scanner>) => NonNullable<ReturnType<Scanner>> }
 */
export default function unhandledScanner(char, input, { start }) {
  let value = char;
  let [next] = input.slice(start + char.length);

  while (isMark(next)) {
    value += next;
    [next] = input.slice(start + value.length);
  }

  return {
    type: "ident",
    value,
    end: start + value.length,
  };
}
