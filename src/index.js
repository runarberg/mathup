import parser from "./parser";

export default function ascii2mathml(
  asciimath,
  {
    annotate = false,
    bare = false,
    display = "inline",
    standalone = false,
    dir = "ltr",

    decimalMark = ".",
    colSep = decimalMark === "," ? ";" : ",",
    rowSep = colSep === ";" ? ";;" : ";"
  } = {}
) {
  // Curry
  if (typeof asciimath === "object") {
    return (str, options2) => {
      const opts = { ...asciimath, ...options2 };
      return ascii2mathml(str, opts);
    };
  }

  if (bare) {
    if (standalone) {
      throw new Error(
        "Can't output a valid HTML without a root <math> element"
      );
    }
    if (display && display.toLowerCase() !== "inline") {
      throw new Error("Can't display block without root element.");
    }
    if (dir && dir.toLowerCase() !== "ltr") {
      throw new Error(
        "Can't have right-to-left direction without root element."
      );
    }
  }

  const parse = parser({
    decimalMark,
    colSep,
    rowSep
  });
  let out;

  const math = bare
    ? expr => expr
    : expr =>
        `<math${display !== "inline" ? ` display="${display}"` : ""}${
          dir !== "ltr" ? ` dir="${dir}"` : ""
        }>${expr}</math>`;

  if (annotate) {
    // Make sure the all presentational part is the first element
    const parsed = parse(asciimath.trim(), "");
    const mathml =
      parsed === parser.getlastel(parsed) ? parsed : `<mrow>${parsed}</mrow>`;

    out = math(
      `<semantics>${mathml}<annotation encoding="application/AsciiMath">${asciimath}</annotation>` +
        `</semantics>`
    );
  } else {
    out = math(parse(asciimath.trim(), ""));
  }

  if (standalone) {
    out =
      `<!DOCTYPE html><html><head><title>${asciimath}</title></head>` +
      `<body>${out}</body></html>`;
  }

  return out;
}
