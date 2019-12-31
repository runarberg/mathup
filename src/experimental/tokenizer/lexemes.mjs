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
  const category = unicodeProperties.getCategory(codePoint);

  return (
    category === "Nd" ||
    category === "Nl" ||
    category === "No" ||
    // Dozen literals are in the So category for some reason.
    codePoint === 0x218a ||
    codePoint === 0x218b
  );
}

export function isOperational(char) {
  if (!char) {
    return false;
  }

  const category = unicodeProperties.getCategory(char.codePointAt(0));

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
  ["CC", "ℂ"],
  ["Delta", "Δ"],
  ["Gamma", "Γ"],
  ["Lambda", "Λ"],
  ["NN", "ℕ"],
  ["O/", "∅"],
  ["Omega", "Ω"],
  ["Phi", "Φ"],
  ["Pi", "Π"],
  ["Psi", "Ψ"],
  ["QQ", "ℚ"],
  ["RR", "ℝ"],
  ["Sigma", "Σ"],
  ["Theta", "Θ"],
  ["Xi", "Ξ"],
  ["ZZ", "ℤ"],
  ["alpha", "α"],
  ["beta", "β"],
  ["chi", "χ"],
  ["cos", "cos"],
  ["cosh", "cosh"],
  ["cot", "cot"],
  ["csc", "csc"],
  ["delta", "δ"],
  ["det", "det"],
  ["dim", "dim"],
  ["epsilon", "ɛ"],
  ["eta", "η"],
  ["gamma", "γ"],
  ["gcd", "gcd"],
  ["iota", "ι"],
  ["kappa", "κ"],
  ["lambda", "λ"],
  ["lcm", "lcm"],
  ["ln", "ln"],
  ["log", "log"],
  ["max", "max"],
  ["min", "min"],
  ["mod", "mod"],
  ["mu", "μ"],
  ["nu", "ν"],
  ["omega", "ω"],
  ["oo", "∞"],
  ["phi", "φ"],
  ["pi", "π"],
  ["psi", "ψ"],
  ["rho", "ρ"],
  ["sec", "sec"],
  ["sigma", "σ"],
  ["sin", "sin"],
  ["sinh", "sinh"],
  ["tan", "tan"],
  ["tanh", "tanh"],
  ["tau", "τ"],
  ["theta", "θ"],
  ["upsilon", "υ"],
  ["xi", "ξ"],
  ["zeta", "ζ"],
]);

export const KNOWN_OPS = new Map([
  ["!=", "≠"],
  ["!in", "∉"],
  ["'", "′"],
  ["''", "″"],
  ["'''", "‴"],
  ["''''", "⁗"],
  ["*", "·"],
  ["**", "∗"],
  ["***", "⋆"],
  ["+-", "±"],
  [",", ","],
  ["-:", "÷"],
  ["-<", "≺"],
  ["-<=", "⪯"],
  ["-=", "≡"],
  ["->", "→"],
  ["->>", "↠"],
  ["...", "…"],
  ["//", "⁄"],
  ["/_", "∠"],
  [":", ":"],
  [":.", "∴"],
  ["<-", "←"],
  ["<=", "≤"],
  ["<=>", "⇔"],
  ["==", "≡"],
  ["=>", "⇒"],
  [">-", "≻"],
  [">-=", "⪰"],
  [">->", "↣"],
  [">->>", "⤖"],
  ["><|", "⋊"],
  [">=", "≥"],
  ["@", "∘"],
  ["AA", "∀"],
  ["EE", "∃"],
  ["TT", "⊤"],
  ["^^", "∧"],
  ["^^^", "⋀"],
  ["__|", "⌋"],
  ["_|_", "⊥"],
  ["aleph", "ℵ"],
  ["and", "and"],
  ["cdots", "⋯"],
  ["darr", "↓"],
  ["ddots", "⋱"],
  ["del", "∂"],
  ["diamond", "⋄"],
  ["dint", "∬"],
  ["grad", "∇"],
  ["hArr", "⇔"],
  ["harr", "↔"],
  ["if", "if"],
  ["iff", "⇔"],
  ["in", "∈"],
  ["int", "∫"],
  ["lArr", "⇐"],
  ["larr", "←"],
  ["lim", "lim"],
  ["nn", "∩"],
  ["nnn", "⋂"],
  ["not", "¬"],
  ["o+", "⊕"],
  ["o.", "⊙"],
  ["oint", "∮"],
  ["or", "or"],
  ["otherwise", "otherwise"],
  ["ox", "⊗"],
  ["prod", "∏"],
  ["prop", "∝"],
  ["rArr", "⇒"],
  ["rarr", "→"],
  ["square", "□"],
  ["sub", "⊂"],
  ["sube", "⊆"],
  ["sum", "∑"],
  ["sup", "⊃"],
  ["supe", "⊇"],
  ["uarr", "↑"],
  ["uu", "∪"],
  ["uuu", "⋃"],
  ["vdots", "⋮"],
  ["vv", "∨"],
  ["vvv", "⋁"],
  ["xx", "×"],
  ["|", "|"],
  ["|--", "⊢"],
  ["|->", "↦"],
  ["|==", "⊨"],
  ["|><", "⋉"],
  ["|><|", "⋈"],
  ["|__", "⌊"],
  ["|~", "⌈"],
  ["~=", "≅"],
  ["~|", "⌉"],
  ["~~", "≈"],
]);

export const KNOWN_PREFIX = new Map([
  // Accents
  ["bar", { name: "over", accent: "‾" }],
  ["ddot", { name: "over", accent: "⋅⋅" }],
  ["dot", { name: "over", accent: "⋅" }],
  ["hat", { name: "over", accent: "^" }],
  ["tilde", { name: "over", accent: "˜" }],
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
]);
