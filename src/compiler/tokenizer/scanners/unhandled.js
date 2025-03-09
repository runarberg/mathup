/**
 * @typedef {import("./index.js").Scanner} Scanner
 * @type {(
 *   ...args: Parameters<Scanner>
 * ) => NonNullable<ReturnType<Scanner>>}
 */
export default function unhandledScanner(char, _input, { start }) {
  return {
    type: "ident",
    value: char,
    end: start + char.length,
  };
}
