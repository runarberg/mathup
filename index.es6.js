import parser from "./lib/parser";

export default function ascii2mathml(asciimath, options) {

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
  options.dir = options.dir || "ltr";

  options.decimalMark = options.decimalMark || ".";
  options.colSep = options.colSep || ",";
  options.rowSep = options.rowSep || ";";

  if (options.decimalMark === "," && options.colSep === ",") {
    options.colSep = ";";
  }
  if (options.colSep === ";" && options.rowSep === ";") {
    options.rowSep = ";;";
  }

  if (options.bare) {
    if (options.standalone) {
      throw new Error(
        "Can't output a valid HTML without a root <math> element"
      );
    }
    if (options.display && options.display.toLowerCase() !== "inline") {
      throw new Error("Can't display block without root element.");
    }
    if (options.dir && options.dir.toLowerCase() !== "ltr") {
      throw new Error(
        "Can't have right-to-left direction without root element."
      );
    }
  }

  const parse = parser(options);
  let out;

  const math = options.bare ? expr => expr :
          expr => `<math${
            options.display !== "inline" ? ` display="${options.display}"` : ""
          }${
            options.dir !== "ltr" ? ` dir="${options.dir}"` : ""
          }>${expr}</math>`;

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
