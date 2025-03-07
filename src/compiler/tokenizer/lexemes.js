/**
 * @typedef {import("./index.js").Token} Token
 * @typedef {(char: string) => boolean} LeximeTest
 */

const LETTER_RE = /^\p{L}/u;

/** @type {LeximeTest} */
export function isAlphabetic(char) {
  if (!char) {
    return false;
  }

  return LETTER_RE.test(char);
}

const LETTER_NUMBER_RE = /^[\p{L}\p{N}]/u;

/** @type {LeximeTest} */
export function isAlphanumeric(char) {
  if (!char) {
    return false;
  }

  return LETTER_NUMBER_RE.test(char);
}

const MARK_RE = /^\p{M}/u;

/** @type {LeximeTest} */
export function isMark(char) {
  if (!char) {
    return false;
  }

  return MARK_RE.test(char);
}

// Duodecimal literals are in the So category.
const NUMBER_RE = /^[\p{N}\u{218a}-\u{218b}]/u;

/** @type {LeximeTest} */
export function isNumeric(char) {
  if (!char) {
    return false;
  }

  return NUMBER_RE.test(char);
}

// Invisible opperators are in the Cf category.
const OPERATOR_RE = /^[\p{P}\p{Sm}\p{So}\u{2061}-\u{2064}]/u;

/** @type {LeximeTest} */
export function isOperational(char) {
  if (!char) {
    return false;
  }

  return OPERATOR_RE.test(char);
}

const PUNCT_OPEN_RE = /^\p{Pe}/u;

/** @type {LeximeTest} */
export function isPunctClose(char) {
  if (!char) {
    return false;
  }

  return PUNCT_OPEN_RE.test(char);
}

const PUNCT_CLOSE_RE = /^\p{Ps}/u;

/** @type {LeximeTest} */
export function isPunctOpen(char) {
  if (!char) {
    return false;
  }

  return PUNCT_CLOSE_RE.test(char);
}

const FUNCTION_IDENT_ATTRS = { class: "mathup-function-ident" };

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
  ["cos", { value: "cos", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["cosh", { value: "cosh", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["cot", { value: "cot", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["csc", { value: "csc", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["cosec", { value: "cosec", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["delta", { value: "δ" }],
  ["det", { value: "det", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["dim", { value: "dim", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["epsilon", { value: "ɛ" }],
  ["eta", { value: "η" }],
  ["gamma", { value: "γ" }],
  ["gcd", { value: "gcd", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["iota", { value: "ι" }],
  ["kappa", { value: "κ" }],
  ["lambda", { value: "λ" }],
  ["lcm", { value: "lcm", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["ln", { value: "ln", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["log", { value: "log", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["max", { value: "max", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["min", { value: "min", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["mu", { value: "μ" }],
  ["nu", { value: "ν" }],
  ["omega", { value: "ω" }],
  ["oo", { value: "∞" }],
  ["phi", { value: "φ" }],
  ["phiv", { value: "ϕ" }],
  ["pi", { value: "π" }],
  ["psi", { value: "ψ" }],
  ["rho", { value: "ρ" }],
  ["sec", { value: "sec", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["sigma", { value: "σ" }],
  ["sin", { value: "sin", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["sinh", { value: "sinh", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["tan", { value: "tan", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["tanh", { value: "tanh", attrs: { ...FUNCTION_IDENT_ATTRS } }],
  ["tau", { value: "τ" }],
  ["theta", { value: "θ" }],
  ["upsilon", { value: "υ" }],
  ["xi", { value: "ξ" }],
  ["zeta", { value: "ζ" }],
]);

export const KNOWN_OPS = new Map([
  ["-", { value: "−" }],
  ["!=", { value: "≠" }],
  ["!==", { value: "≢" }],
  ["!in", { value: "∉" }],
  [".$", { value: "\u2061", attrs: { class: "mathup-function-application" } }],
  [".*", { value: "\u2062", attrs: { class: "mathup-invisible-times" } }],
  [".+", { value: "\u2064", attrs: { class: "mathup-invisible-add" } }],
  [".,", { value: "\u2063", attrs: { class: "mathup-invisible-separator" } }],
  ["'", { value: "′", attrs: { lspace: 0, rspace: 0 } }],
  ["''", { value: "″", attrs: { lspace: 0, rspace: 0 } }],
  ["'''", { value: "‴", attrs: { lspace: 0, rspace: 0 } }],
  ["''''", { value: "⁗", attrs: { lspace: 0, rspace: 0 } }],
  ["*", { value: "·" }],
  ["**", { value: "∗" }],
  ["***", { value: "⋆" }],
  ["+-", { value: "±" }],
  ["-+", { value: "∓" }],
  ["-:", { value: "÷" }],
  ["-<", { value: "≺" }],
  ["-<=", { value: "⪯" }],
  ["-=", { value: "≡" }],
  ["->", { value: "→" }],
  ["->>", { value: "↠" }],
  ["...", { value: "…" }],
  ["//", { value: "⁄" }],
  ["/_", { value: "∠" }],
  ["/_\\", { value: "△" }],
  [":.", { value: "∴" }],
  ["<-", { value: "←" }],
  ["<<<", { value: "≪" }],
  ["<=", { value: "≤" }],
  ["<=>", { value: "⇔" }],
  ["<>", { value: "⋄" }],
  ["<|", { value: "⊲" }],
  ["==", { value: "≡" }],
  ["=>", { value: "⇒" }],
  [">-", { value: "≻" }],
  [">-=", { value: "⪰" }],
  [">->", { value: "↣" }],
  [">->>", { value: "⤖" }],
  ["><|", { value: "⋊" }],
  [">=", { value: "≥" }],
  [">>>", { value: "≫" }],
  ["@", { value: "∘" }],
  ["AA", { value: "∀" }],
  ["EE", { value: "∃" }],
  ["TT", { value: "⊤" }],
  ["[]", { value: "□" }],
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
  ["oc", { value: "∝" }],
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
  ["|>", { value: "⊳" }],
  ["|><", { value: "⋉" }],
  ["|><|", { value: "⋈" }],
  ["~=", { value: "≅" }],
  ["~~", { value: "≈" }],
]);

/** @type {Map<string, Omit<Token, "type">>} */
export const KNOWN_PARENS_OPEN = new Map([
  ["(:", { value: "⟨" }],
  ["<<", { value: "⟨" }],
  ["{:", { value: "" }],
  ["|(", { value: "|" }],
  ["|__", { value: "⌊" }],
  ["||(", { value: "‖" }],
  ["|~", { value: "⌈" }],
  [
    "(mod",
    {
      value: "(",
      attrs: { lspace: "1.65ex" },
      extraTokensAfter: [
        { type: "operator", value: "mod", attrs: { lspace: 0 } },
      ],
    },
  ],
]);

export const KNOWN_PARENS_CLOSE = new Map([
  [")|", { value: "|" }],
  [")||", { value: "‖" }],
  [":)", { value: "⟩" }],
  [":}", { value: "" }],
  [">>", { value: "⟩" }],
  ["__|", { value: "⌋" }],
  ["~|", { value: "⌉" }],
]);

export const KNOWN_PREFIX = new Map([
  // Accents
  ["bar", { name: "over", accent: "‾" }],
  ["ddot", { name: "over", accent: "⋅⋅" }],
  ["dot", { name: "over", accent: "⋅" }],
  ["hat", { name: "over", accent: "^" }],
  ["obrace", { name: "over", accent: "⏞" }],
  ["obracket", { name: "over", accent: "⎴" }],
  ["oparen", { name: "over", accent: "⏜" }],
  ["oshell", { name: "over", accent: "⏠" }],
  ["tilde", { name: "over", accent: "˜" }],
  ["ubrace", { name: "under", accent: "⏟" }],
  ["ubrace", { name: "under", accent: "⏟" }],
  ["ubracket", { name: "under", accent: "⎵" }],
  ["ul", { name: "under", accent: "_" }],
  ["uparen", { name: "under", accent: "⏝" }],
  ["ushell", { name: "under", accent: "⏡" }],
  ["vec", { name: "over", accent: "→" }],

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
  ["norm", { name: "fence", attrs: { open: "‖", close: "‖" } }],

  // Roots
  ["root", { name: "root", arity: 2 }],
  ["sqrt", { name: "sqrt" }],

  // Enclose
  ["cancel", { name: "row", attrs: { class: "mathup-enclose-cancel" } }],
]);

export const KNOWN_COMMANDS = new Map([
  // Fonts
  ["rm", { name: "text-transform", value: "normal" }],
  ["bf", { name: "text-transform", value: "bold" }],
  ["it", { name: "text-transform", value: "italic" }],
  ["bb", { name: "text-transform", value: "double-struck" }],
  ["cc", { name: "text-transform", value: "script" }],
  ["tt", { name: "text-transform", value: "monospace" }],
  ["fr", { name: "text-transform", value: "fraktur" }],
  ["sf", { name: "text-transform", value: "sans-serif" }],

  // Colors
  ["black", { name: "color", value: "black" }],
  ["blue", { name: "color", value: "blue" }],
  ["cyan", { name: "color", value: "cyan" }],
  ["gray", { name: "color", value: "gray" }],
  ["green", { name: "color", value: "green" }],
  ["lightgray", { name: "color", value: "lightgray" }],
  ["orange", { name: "color", value: "orange" }],
  ["purple", { name: "color", value: "purple" }],
  ["red", { name: "color", value: "red" }],
  ["white", { name: "color", value: "white" }],
  ["yellow", { name: "color", value: "yellow" }],

  // Background Colors
  ["bg.black", { name: "background", value: "black" }],
  ["bg.blue", { name: "background", value: "blue" }],
  ["bg.cyan", { name: "background", value: "cyan" }],
  ["bg.gray", { name: "background", value: "gray" }],
  ["bg.green", { name: "background", value: "green" }],
  ["bg.lightgray", { name: "background", value: "lightgray" }],
  ["bg.orange", { name: "background", value: "orange" }],
  ["bg.purple", { name: "background", value: "purple" }],
  ["bg.red", { name: "background", value: "red" }],
  ["bg.white", { name: "background", value: "white" }],
  ["bg.yellow", { name: "background", value: "yellow" }],
]);
