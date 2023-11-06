import { isNumeric } from "../lexemes.js";

/** @type {import("./index.js").Scanner} */
export default function numberScanner(char, input, { start }, { decimalMark }) {
  if (!isNumeric(char)) {
    return null;
  }

  let nextChar = char;
  let value = "";

  while (isNumeric(nextChar)) {
    value += nextChar;
    [nextChar] = input.slice(start + value.length);
  }

  if (nextChar === decimalMark) {
    [nextChar] = input.slice(start + value.length + decimalMark.length);

    if (isNumeric(nextChar)) {
      value += decimalMark;

      while (isNumeric(nextChar)) {
        value += nextChar;
        [nextChar] = input.slice(start + value.length);
      }
    }
  }

  return {
    type: "number",
    value,
    end: start + value.length,
  };
}
