import alpha from "./alpha.js";
import backslash from "./backslash.js";
import backtick from "./backtick.js";
import groupSep from "./group-sep.js";
import infix from "./infix.js";
import newline from "./newline.js";
import number from "./number.js";
import octothorpe from "./octothorpe.js";
import operator from "./operator.js";
import parenClose from "./paren-close.js";
import parenOpen from "./paren-open.js";
import quote from "./quote.js";
import space from "./space.js";

export { default as unhandled } from "./unhandled.js";

/**
 * @typedef {Required<import("../index.js").TokenizerOptions>} Options
 * @typedef {import("../index.js").State} State
 * @typedef {import("../index.js").Token} Token
 * @typedef {(
 *   char: string,
 *   input: string,
 *   state: State,
 *   options: Options,
 * ) => (Token & { end: number }) | null} Scanner
 * @type {Scanner[]}
 */
export default [
  space,
  alpha,
  number,
  backtick,
  quote,
  octothorpe,
  backslash,
  newline,
  infix,
  groupSep,
  parenOpen,
  parenClose,
  operator,
];
