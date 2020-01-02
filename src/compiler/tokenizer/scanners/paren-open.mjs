import { isPunctOpen } from "../lexemes.mjs";

export default function(char, input, { start }) {
  let end = start + char.length;
  let value = char;

  if (char === "|") {
    if (input[end] === "(") {
      return {
        type: "paren.open",
        value: "|",
        end: end + 1,
      };
    }

    if (input[end] === "|" && input[end + 1] === "(") {
      return {
        type: "paren.open",
        value: "∥",
        end: end + 2,
      };
    }
  }

  if (!isPunctOpen(char)) {
    return null;
  }

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
