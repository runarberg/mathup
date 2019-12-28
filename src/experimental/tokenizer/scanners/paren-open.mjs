import { isPunctOpen } from "../lexemes.mjs";

export default function(char, input, { start }) {
  if (!isPunctOpen(char)) {
    return null;
  }

  let end = start + char.length;
  let value = char;

  if (input[end] === ":") {
    if (char === "(") {
      value = "⟨";
      end += 1;
    } else if (char === "{") {
      value = "";
      end += 1;
    }
  }

  return {
    type: "paren.open",
    value,
    end,
  };
}
