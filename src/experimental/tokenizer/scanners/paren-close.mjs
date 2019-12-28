import { isPunctClose } from "../lexemes.mjs";

export default function(char, input, { grouping, start }) {
  if (!grouping) {
    return null;
  }

  if (isPunctClose(char)) {
    return {
      type: "paren.close",
      value: char,
      end: start + char.length,
    };
  }

  if (char === ":") {
    const value = `:${input[start + 1]}`;

    if (value === ":)") {
      return {
        type: "paren.close",
        value: "⟩",
        end: start + 2,
      };
    }

    if (value === ":}") {
      return {
        type: "paren.close",
        value: "",
        end: start + 2,
      };
    }
  }

  return null;
}
