"use strict";

// Identifiers
// ===========

var  funs = ["sin", "cos", "tan", "csc", "sec", "cot", "sinh",
             "cosh", "tanh", "log", "ln", "det", "dim", "lim",
             "mod", "gcd", "lcm", "min", "max"];

var identifiers = {
  // Greek uppercase
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ',
  Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  // Greek lowercase
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ɛ',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ',
  sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ',
  psi: 'ψ', omega: 'ω',
  // Special symbols
  oo: "∞", "O/": "∅",
  // Blackboard
  CC: "ℂ", NN: "ℕ", QQ: "ℚ", RR: "ℝ", ZZ: "ℤ"
};

funs.forEach(function(fun) {
  identifiers[fun] = fun;
});

Object.defineProperty(identifiers, "contains", {
  value: function(char) {
    return typeof identifiers[char] !== "undefined";
  }
});

Object.defineProperty (identifiers, "funs", {
  value: funs
});

Object.defineProperty (identifiers, "isfun", {
  value: function(str) {
    return funs.indexOf(str) >= 0;
  }
});


// Operators
// =========

var operators = {
  // Operational
  "*": "·", "**": "∗", "***": "⋆", "//": "/",
  "|": "|", ":": ':', "'": '′', "''": '″', "'''": '‴', "''''": '⁗',
  xx: "×", "-:": "÷", "@": "∘", "o+": "⊕", "ox": "⊗", "o.": "⊙",
  "!": "!", "sum": "∑", "prod": "∏", "^^": "∧", "^^^": "⋀",
  "vv": "∨", "vvv": "⋁", "nn": "∩", "nnn": "⋂", "uu": "∪", "uuu": "⋃",
  // Miscellaneous
  int: "∫", oint: "∮", dint: "∬", "+-": "±", del: "∂", grad: "∇",
  aleph: "ℵ", "/_": "∠", dimond: "⋄", square: '□', "|__": '⌊',
  "__|": "⌋", "|~": '⌈', "~|": '⌉',
  // Relational
  "=": "=", "!=": "≠", "<": "&lt;", ">": "&gt;", "<=": "≤", ">=": "≥",
  "-<": "≺", ">-": "≻", in: "∈", "!in": "∉", sub: "⊂", sup: "⊃",
  sube: "⊆", supe: "⊇", "-=": "≡", "~~": "≈", prop: "∝",
  // Arrows
  "<-": "←", "->": "→", "=>": "⇒", "<=>": "⇔", "|->": '↦',
  "uarr": '↑', "darr": '↓', "larr": '←', "rarr": '→', "harr": '↔',
  "lArr": '⇐', rArr: '⇒', "hArr": '⇔', "iff": "⇔",
  // Punctuations
  ",": ",", ":.": "∴", "...": "…", cdots: "⋯", ddots: "⋱", vdots: "⋮",
  // Logical
  if: "if", otherwise: "otherwise", and: "and", or: "or", not: "¬",
  AA: "∀", "EE": '∃', "_|_": '⊥', "TT": '⊤', "|--": '⊢', "|==": '⊨'
};

Object.defineProperty(operators, "contains", {
  value: function(char) {
    return typeof operators[char] !== 'undefined';
  }
});

Object.defineProperty(operators, "get", {
  value: function(char) {
    return operators[char] || char;
  }
});

Object.defineProperty(operators, "regexp", {
  value: new RegExp(
    "(" +
      Object.keys(operators)
      .sort(function(a, b) { return b.length - a.length; })
      .map(regexpEscape)
      .join('|') +
      "|[+\-<=>|~¬±×÷ϐϑϒϕϰϱϴϵ϶؆؇؈‖′″‴⁀⁄⁒\u2061-\u2064" +
      "\u207A-\u207E\u208A-\u208E★☆♠♡♢♣♭♮♯﬩\uFF61-\uFF68" +
      "＋＜＝＞＼＾｜～￢￩￪￫￬" +
      "\u2200-\u22FF\u2A00-\u2AFF\u27C0-\u27E5\u2980-\u2982" +
      "\u2999-\u29FF\u2301-\u23FF\u25A0-\u25FF\u2B00-\u2BFF" +
      "\u2190-\u21FF\u27F0-\u27FF\u2900-\u297F\u20D0-\u20EF]" +
      ")")
});


function regexpEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


// Groupings
// =========

var groupings = {
  open: { "(:": "⟨", "{:": "" },
  close: { ":)": "⟩", ":}": "" }
};

Object.defineProperty(groupings.open, "regexp", {
  value: /([[⟦⟨⟪⟬⟮⦃⦅⦇⦉⦋⦍⦏⦑⦓⦕⦗]|[({]:?)/
});

Object.defineProperty(groupings.close, "regexp", {
  value: /([\]⟧⟩⟫⟭⟯⦄⦆⦈⦊⦌⦎⦐⦒⦔⦖⦘]|:?[)}])/
});

Object.defineProperty(groupings.open, "get", {
  value: function(str) {
    let match = groupings.open[str];
    return typeof match === "string" ? match : str;
  }
});

Object.defineProperty(groupings.close, "get", {
  value: function(str) {
    let match = groupings.close[str];
    return typeof match === "string" ? match : str;
  }
});

Object.freeze(groupings.open);
Object.freeze(groupings.close);


// Font
// ====

var fonts = {
  rm: "normal", bf: "bold", it: "italic", bb: "double-struck",
  cc: "script", tt: "monospace", fr: "fraktur",
  sf: "sans-serif"
};

Object.defineProperty(fonts, "get", {
  value: function(str) { return fonts[str] || undefined; }
});

Object.defineProperty(fonts, "regexp", {
  value: new RegExp("(" + Object.keys(fonts).join('|') + ")")
});


// Accents
// =======

var accents = {
  hat: "^", bar: "‾", ul: "_", vec: "→", dot: "⋅", ddot: "⋅⋅"
};

Object.defineProperty(accents, "contains", {
  value: function(str) { return Object.keys(accents).indexOf(str) >= 0; }
});

Object.defineProperty(accents, "get", {
  value: function(str) { return accents[str] || undefined; }
});

Object.defineProperty(accents, "regexp", {
  value: new RegExp("(" + Object.keys(accents).join('|') + ")")
});


module.exports = {
  identifiers: Object.freeze(identifiers),
  operators: Object.freeze(operators),
  groupings: Object.freeze(groupings),
  fonts: Object.freeze(fonts),
  accents: Object.freeze(accents)
};
