"use strict";

require("babel/polyfill");

const parser = require("./lib/parser");

function ascii2mathml(asciimath, options) {

  // Curry
  if (typeof asciimath === "object") {
    return function(str, options2) {
      let opts = Object.assign({}, asciimath, options2);
      return ascii2mathml(str, opts);
    };
  }

  options = typeof options === "object" ? options : {};
  options.annotate = options.annotate || false;
  options.bare = options.bare || false;
  options.display = options.display || "inline";
  options.standalone = options.standalone || false;

  options.decimalMark = options.decimalMark || ".";
  options.colSep = options.colSep || ",";
  options.rowSep = options.rowSep || ";";

  if (options.decimalMark === "," && options.colSep === ",") {
    options.colSep = ";";
  }
  if (options.colSep === ";" && options.rowSep === ";") {
    options.rowSep = ";;";
  }

  const parse = parser(options);
  let out;

  if (options.bare) {
    if (options.standalone) {
      throw new Error(
        "Can't output a valid HTML without a root <math> element"
      );
    }
    if (options.display && options.display.toLowerCase() === "block") {
      throw new Error("Can't display block without root element.");
    }
  }

  const math =
          options.display !== "inline" ? expr =>
            `<math display="${options.display}">${expr}</math>` :
          options && options.bare ? expr => expr :
          expr => `<math>${expr}</math>`;

  if (options.annotate) {
    // Make sure the all presentational part is the first element
    let parsed = parse(asciimath.trim(), ""),
        mathml = parsed === parser.getlastel(parsed) ?
          parsed :
          `<mrow>${parsed}</mrow>`;

    out = math("<semantics>" + mathml +
               '<annotation encoding="application/AsciiMath">' +
               asciimath +
               "</annotation>" +
               "</semantics>");

  } else {
    out = math(parse(asciimath.trim(), ""));
  }

  if (options.standalone) {
    out = "<!DOCTYPE html><html><head><title>" +
      asciimath +
      "</title></head>" +
      "<body>" +
      out +
      "</body></html>";
  }

  return out;
}

module.exports = ascii2mathml;
