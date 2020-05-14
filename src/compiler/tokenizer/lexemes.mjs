import { unicodeProperties } from "../../../dependencies.mjs";

export function isAlphabetic(char) {
  if (!char) {
    return false;
  }

  const category = unicodeProperties.getCategory(char.codePointAt(0));

  return (
    category === "Lu" ||
    category === "Ll" ||
    category === "Lt" ||
    category === "Lm" ||
    category === "Lo"
  );
}

export function isAlphanumeric(char) {
  if (!char) {
    return false;
  }

  const category = unicodeProperties.getCategory(char.codePointAt(0));

  return (
    category === "Lu" ||
    category === "Ll" ||
    category === "Lt" ||
    category === "Lm" ||
    category === "Lo" ||
    category === "Nd" ||
    category === "Nl" ||
    category === "No"
  );
}

export function isMark(char) {
  if (!char) {
    return false;
  }

  return unicodeProperties.isMark(char.codePointAt(0));
}

export function isNumeric(char) {
  if (!char) {
    return false;
  }

  const codePoint = char.codePointAt(0);

  // Dozenal literals are in the So category for some reason.
  if (codePoint === 0x218a || codePoint === 0x218b) {
    return true;
  }

  const category = unicodeProperties.getCategory(codePoint);

  return category === "Nd" || category === "Nl" || category === "No";
}

export function isOperational(char) {
  if (!char) {
    return false;
  }

  const codePoint = char.codePointAt(0);

  // Invisible opperators are in the Cf category.
  if (codePoint >= 0x2061 && codePoint <= 0x2064) {
    return true;
  }

  const category = unicodeProperties.getCategory(codePoint);

  return (
    category === "Pc" ||
    category === "Pd" ||
    category === "Pe" ||
    category === "Pf" ||
    category === "Pi" ||
    category === "Po" ||
    category === "Ps" ||
    category === "Sm" ||
    category === "So"
  );
}

export function isPunctClose(char) {
  if (!char) {
    return false;
  }

  const category = unicodeProperties.getCategory(char.codePointAt(0));

  return category === "Pe";
}

export function isPunctOpen(char) {
  if (!char) {
    return false;
  }

  const category = unicodeProperties.getCategory(char.codePointAt(0));

  return category === "Ps";
}

export const KNOWN_IDENTS = new Map([
  ["CC", { value: "ℂ" }],
  ["Delta", { value: "Δ", attrs: { mathvariant: "normal" } }],
  ["Gamma", { value: "Γ", attrs: { mathvariant: "normal" } }],
  ["Lambda", { value: "Λ", attrs: { mathvariant: "normal" } }],
  ["NN", { value: "ℕ" }],
  ["O/", { value: "∅" }],
  ["Omega", { value: "Ω", attrs: { mathvariant: "normal" } }],
  ["Phi", { value: "Φ", attrs: { mathvariant: "normal" } }],
  ["Pi", { value: "Π", attrs: { mathvariant: "normal" } }],
  ["Psi", { value: "Ψ", attrs: { mathvariant: "normal" } }],
  ["QQ", { value: "ℚ" }],
  ["RR", { value: "ℝ" }],
  ["Sigma", { value: "Σ", attrs: { mathvariant: "normal" } }],
  ["Theta", { value: "Θ", attrs: { mathvariant: "normal" } }],
  ["Xi", { value: "Ξ", attrs: { mathvariant: "normal" } }],
  ["ZZ", { value: "ℤ" }],
  ["alpha", { value: "α" }],
  ["beta", { value: "β" }],
  ["chi", { value: "χ" }],
  ["cos", { value: "cos" }],
  ["cosh", { value: "cosh" }],
  ["cot", { value: "cot" }],
  ["csc", { value: "csc" }],
  ["delta", { value: "δ" }],
  ["det", { value: "det" }],
  ["dim", { value: "dim" }],
  ["epsilon", { value: "ɛ" }],
  ["eta", { value: "η" }],
  ["gamma", { value: "γ" }],
  ["gcd", { value: "gcd" }],
  ["iota", { value: "ι" }],
  ["kappa", { value: "κ" }],
  ["lambda", { value: "λ" }],
  ["lcm", { value: "lcm" }],
  ["ln", { value: "ln" }],
  ["log", { value: "log" }],
  ["max", { value: "max" }],
  ["min", { value: "min" }],
  ["mu", { value: "μ" }],
  ["nu", { value: "ν" }],
  ["omega", { value: "ω" }],
  ["oo", { value: "∞" }],
  ["phi", { value: "φ" }],
  ["phiv", { value: "ϕ" }],
  ["pi", { value: "π" }],
  ["psi", { value: "ψ" }],
  ["rho", { value: "ρ" }],
  ["sec", { value: "sec" }],
  ["sigma", { value: "σ" }],
  ["sin", { value: "sin" }],
  ["sinh", { value: "sinh" }],
  ["tan", { value: "tan" }],
  ["tanh", { value: "tanh" }],
  ["tau", { value: "τ" }],
  ["theta", { value: "θ" }],
  ["upsilon", { value: "υ" }],
  ["xi", { value: "ξ" }],
  ["zeta", { value: "ζ" }],

  // Colors
  // We also set attrs so that users will have a preview when
  // they are used as standalone identifiers.
  ["aqua", { value: "aqua", attrs: { mathcolor: "aqua" } }],
  ["black", { value: "black", attrs: { mathcolor: "black" } }],
  ["blue", { value: "blue", attrs: { mathcolor: "blue" } }],
  ["fuchsia", { value: "fuchsia", attrs: { mathcolor: "fuchsia" } }],
  ["gray", { value: "gray", attrs: { mathcolor: "gray" } }],
  ["green", { value: "green", attrs: { mathcolor: "green" } }],
  ["lime", { value: "lime", attrs: { mathcolor: "lime" } }],
  ["maroon", { value: "maroon", attrs: { mathcolor: "maroon" } }],
  ["navy", { value: "navy", attrs: { mathcolor: "navy" } }],
  ["olive", { value: "olive", attrs: { mathcolor: "olive" } }],
  ["purple", { value: "purple", attrs: { mathcolor: "purple" } }],
  ["red", { value: "red", attrs: { mathcolor: "red" } }],
  ["silver", { value: "silver", attrs: { mathcolor: "silver" } }],
  ["teal", { value: "teal", attrs: { mathcolor: "teal" } }],
  ["white", { value: "white", attrs: { mathcolor: "white" } }],
  ["yellow", { value: "yellow", attrs: { mathcolor: "yellow" } }],
  ["transparent", { value: "transparent" }],
]);

export const KNOWN_OPS = new Map([
  ["!=", { value: "≠" }],
  ["!in", { value: "∉" }],
  ["&$", { value: "\u2061" }],
  ["&*", { value: "\u2062" }],
  ["&+", { value: "\u2064" }],
  ["&,", { value: "\u2063" }],
  ["'", { value: "′", attrs: { lspace: 0, rspace: 0 } }],
  ["''", { value: "″", attrs: { lspace: 0, rspace: 0 } }],
  ["'''", { value: "‴", attrs: { lspace: 0, rspace: 0 } }],
  ["''''", { value: "⁗", attrs: { lspace: 0, rspace: 0 } }],
  ["*", { value: "·" }],
  ["**", { value: "∗" }],
  ["***", { value: "⋆" }],
  ["+-", { value: "±" }],
  ["-:", { value: "÷" }],
  ["-<", { value: "≺" }],
  ["-<=", { value: "⪯" }],
  ["-=", { value: "≡" }],
  ["->", { value: "→" }],
  ["->>", { value: "↠" }],
  ["...", { value: "…" }],
  ["//", { value: "⁄" }],
  ["/_", { value: "∠" }],
  [":.", { value: "∴" }],
  ["<-", { value: "←" }],
  ["<=", { value: "≤" }],
  ["<=>", { value: "⇔" }],
  ["==", { value: "≡" }],
  ["=>", { value: "⇒" }],
  [">-", { value: "≻" }],
  [">-=", { value: "⪰" }],
  [">->", { value: "↣" }],
  [">->>", { value: "⤖" }],
  ["><|", { value: "⋊" }],
  [">=", { value: "≥" }],
  ["@", { value: "∘" }],
  ["AA", { value: "∀" }],
  ["EE", { value: "∃" }],
  ["TT", { value: "⊤" }],
  ["^^", { value: "∧" }],
  ["^^^", { value: "⋀" }],
  ["_|_", { value: "⊥" }],
  ["aleph", { value: "ℵ" }],
  ["and", { value: "and" }],
  ["cdots", { value: "⋯" }],
  ["darr", { value: "↓" }],
  ["ddots", { value: "⋱" }],
  ["del", { value: "∂" }],
  ["diamond", { value: "⋄" }],
  ["dint", { value: "∬" }],
  ["grad", { value: "∇" }],
  ["hArr", { value: "⇔" }],
  ["harr", { value: "↔" }],
  ["if", { value: "if" }],
  ["iff", { value: "⇔" }],
  ["in", { value: "∈" }],
  ["int", { value: "∫" }],
  ["lArr", { value: "⇐" }],
  ["larr", { value: "←" }],
  ["lim", { value: "lim" }],
  ["mod", { value: "mod" }],
  ["nn", { value: "∩" }],
  ["nnn", { value: "⋂" }],
  ["not", { value: "¬" }],
  ["o+", { value: "⊕" }],
  ["o.", { value: "⊙" }],
  ["oint", { value: "∮" }],
  ["or", { value: "or" }],
  ["otherwise", { value: "otherwise" }],
  ["ox", { value: "⊗" }],
  ["prod", { value: "∏" }],
  ["prop", { value: "∝" }],
  ["rArr", { value: "⇒" }],
  ["rarr", { value: "→" }],
  ["square", { value: "□" }],
  ["sub", { value: "⊂" }],
  ["sube", { value: "⊆" }],
  ["sum", { value: "∑" }],
  ["sup", { value: "⊃" }],
  ["supe", { value: "⊇" }],
  ["uarr", { value: "↑" }],
  ["uu", { value: "∪" }],
  ["uuu", { value: "⋃" }],
  ["vdots", { value: "⋮" }],
  ["vv", { value: "∨" }],
  ["vvv", { value: "⋁" }],
  ["xx", { value: "×" }],
  ["||", { value: "∥" }],
  ["|--", { value: "⊢" }],
  ["|->", { value: "↦" }],
  ["|==", { value: "⊨" }],
  ["|><", { value: "⋉" }],
  ["|><|", { value: "⋈" }],
  ["~=", { value: "≅" }],
  ["~~", { value: "≈" }],
]);

export const KNOWN_PARENS_OPEN = new Map([
  ["(:", { value: "⟨" }],
  ["<<", { value: "⟨" }],
  ["{:", { value: "" }],
  ["|(", { value: "|" }],
  ["|__", { value: "⌊" }],
  ["||(", { value: "∥" }],
  ["|~", { value: "⌈" }],
]);

export const KNOWN_PARENS_CLOSE = new Map([
  [")|", { value: "|" }],
  [")||", { value: "∥" }],
  [":)", { value: "⟩" }],
  [":}", { value: "" }],
  [">>", { value: "⟩" }],
  ["__|", { value: "⌋" }],
  ["~|", { value: "⌉" }],
]);

export const KNOWN_PREFIX = new Map([
  // Accents
  ["bar", { name: "over", accent: "‾" }],
  ["obrace", { name: "over", accent: "⏞" }],
  ["ddot", { name: "over", accent: "⋅⋅" }],
  ["dot", { name: "over", accent: "⋅" }],
  ["hat", { name: "over", accent: "^" }],
  ["tilde", { name: "over", accent: "˜" }],
  ["ubrace", { name: "under", accent: "⏟" }],
  ["ul", { name: "under", accent: "_" }],
  ["vec", { name: "over", accent: "→" }],

  // Fonts
  ["rm", { name: "style", attrs: { mathvariant: "normal" } }],
  ["bf", { name: "style", attrs: { mathvariant: "bold" } }],
  ["it", { name: "style", attrs: { mathvariant: "italic" } }],
  ["bb", { name: "style", attrs: { mathvariant: "double-struck" } }],
  ["cc", { name: "style", attrs: { mathvariant: "script" } }],
  ["tt", { name: "style", attrs: { mathvariant: "monospace" } }],
  ["fr", { name: "style", attrs: { mathvariant: "fraktur" } }],
  ["sf", { name: "style", attrs: { mathvariant: "sans-serif" } }],

  // Groups
  ["abs", { name: "fence", attrs: { open: "|", close: "|" } }],
  [
    "binom",
    {
      name: "frac",
      arity: 2,
      attrs: { linethickness: 0, open: "(", close: ")" },
    },
  ],
  ["ceil", { name: "fence", attrs: { open: "⌈", close: "⌉" } }],
  ["floor", { name: "fence", attrs: { open: "⌊", close: "⌋" } }],
  ["norm", { name: "fence", attrs: { open: "∥", close: "∥" } }],

  // Notations
  ["cancel", { name: "enclose", attrs: { notation: "updiagonalstrike" } }],

  // Roots
  ["root", { name: "root", arity: 2 }],
  ["sqrt", { name: "sqrt" }],

  // Attributes
  ["id", { name: "style", attrName: "id", arity: 2 }],
  ["href", { name: "style", attrName: "href", arity: 2 }],
  ["color", { name: "style", attrName: "mathcolor", arity: 2 }],
  ["background", { name: "style", attrName: "mathbackground", arity: 2 }],
]);
