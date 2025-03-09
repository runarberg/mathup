import { isMark } from "./lexemes.js";
import scanners, { unhandled } from "./scanners/index.js";

/**
 * @typedef {"command"
 *   | "ident"
 *   | "infix"
 *   | "number"
 *   | "operator"
 *   | "paren.close"
 *   | "paren.open"
 *   | "prefix"
 *   | "sep.col"
 *   | "sep.row"
 *   | "space"
 *   | "text"} TokenType
 *
 * @typedef {object} Token
 * @property {TokenType} type
 * @property {string} value
 * @property {string} [accent]
 * @property {number} [arity]
 * @property {string} [name]
 * @property {boolean} [split] - Can be broken up into smaller units.
 * @property {boolean} [sep] - Can function as a group seperator.
 * @property {Record<string, string | number | boolean | null | undefined>} [attrs]
 * @property {Token[]} [extraTokensAfter]
 *
 * @typedef {object} State
 * @property {number} start
 * @property {boolean} grouping
 *
 * @typedef {object} TokenizerOptions
 * @property {string} [decimalMark="."] - Decimal separator. Default is `"."`
 * @property {string} [colSep=","] - Column separator e.g. for arrays and
 *   matrices. Default is `","`
 * @property {string} [rowSep=";"] - Row separator e.g. for matrices. Default is
 *   `";"`
 *
 * @param {Required<TokenizerOptions>} options
 * @returns {(input: string) => Generator<Token>}
 */
export default function createTokenizer(options) {
  /**
   * @param {string} input
   * @param {State} state
   * @returns {Token & { end: number }}
   */
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

  /**
   * @param {string} input
   * @yields {Token}
   */
  return function* tokenize(input) {
    let pos = 0;
    let nestLevel = 0;

    while (pos < input.length) {
      const { type, value, end, split, extraTokensAfter, ...attrs } = nextToken(
        input,
        {
          start: pos,
          grouping: nestLevel > 0,
        },
      );

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

      if (extraTokensAfter) {
        for (const token of extraTokensAfter) {
          yield token;
        }
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
