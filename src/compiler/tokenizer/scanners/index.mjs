import alpha from "./alpha.mjs";
import backslash from "./backslash.mjs";
import backtick from "./backtick.mjs";
import groupSep from "./group-sep.mjs";
import infix from "./infix.mjs";
import newline from "./newline.mjs";
import number from "./number.mjs";
import octothorpe from "./octothorpe.mjs";
import operator from "./operator.mjs";
import parenClose from "./paren-close.mjs";
import parenOpen from "./paren-open.mjs";
import quote from "./quote.mjs";
import space from "./space.mjs";

export { default as unhandled } from "./unhandled.mjs";

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
