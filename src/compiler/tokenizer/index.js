import scanners, { unhandled } from "./scanners/index.js";
import { isMark } from "./lexemes.js";

export default function createTokenizer({
  decimalMark = ".",
  colSep = decimalMark === "," ? ";" : ",",
  rowSep = colSep === ";" ? ";;" : ";",
} = {}) {
  const options = { decimalMark, colSep, rowSep };

  function nextToken(input, state) {
    const [char] = input.slice(state.start);

    for (const scan of scanners) {
      const token = scan(char, input, state, options);

      if (token) {
        return token;
      }
    }

    return unhandled(char, input, state, options);
  }

  return function* tokenize(input) {
    let pos = 0;
    let nestLevel = 0;

    while (pos < input.length) {
      const { type, value, end, split, ...attrs } = nextToken(input, {
        start: pos,
        grouping: nestLevel > 0,
      });

      if (split) {
        let char = "";

        for (const codePoint of value) {
          if (isMark(codePoint)) {
            char += codePoint;
          } else if (char) {
            yield {
              type,
              value: char,
            };

            char = codePoint;
          } else {
            char = codePoint;
          }
        }

        if (char) {
          yield {
            type,
            value: char,
          };
        }
      } else {
        yield {
          type,
          value,
          ...attrs,
        };
      }

      pos = end;

      if (type === "paren.open") {
        nestLevel += 1;
      } else if (type === "paren.close" && nestLevel > 0) {
        nestLevel -= 1;
      }
    }
  };
}
