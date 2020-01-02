import { isMark } from "../lexemes.mjs";

export default function unhandled(char, input, { start }) {
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
