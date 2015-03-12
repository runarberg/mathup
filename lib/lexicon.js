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
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ',
  sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'ϕ', chi: 'χ',
  psi: 'ψ', omega: 'ω',
  // Greek mathematical
  varepsilon: 'ɛ', varphi: 'φ', vartheta: 'ϑ',
  // Special symbols
  grad: "∇", oo: "∞", "O/": "∅",
  // Blackboard
  CC: "ℂ", NN: "ℕ", QQ: "ℚ", RR: "ℝ", ZZ: "ℤ",
  // Other
  aleph: "ℵ", del: "∂"
};

funs.forEach(function(fun) {
  identifiers[fun] = fun;
});

Object.defineProperty(identifiers, "contains", {
  value: function(char) {
    return typeof identifiers[char] !== "undefined";
  }
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
  "+": "+", "-": "-", "*": "·", "**": "*", "***": "⋆", "//": "/",
  xx: "×", "-:": "÷", "@": "∘", "o+": "⊕", "ox": "⊗", "o.": "⊙",
  "!": "!", "sum": "∑", "prod": "∏", "^^": "∧", "^^^": "⋀",
  "vv": "∨", "vvv": "⋁", "nn": "∩", "nnn": "⋂", "uu": "∪", "uuu": "⋃",
  // Miscellaneous
  int: "∫", oint: "∮", dint: "∬", "+-": "±",
  // Relational
  "=": "=", "!=": "≠", "<": "&lt;", ">": "&gt;", "<=": "≤", ">=": "≥",
  "-<": "≺", ">-": "≻", in: "∈", "!in": "∉", "-=": "≡", "~~": "≈",
  // Arrows
  "->": "→",
  // Punctuations
  ",": ",", ":.": "∴", "..": "..", "...": "…", cdots: "⋯", ddots: "⋱", vdots: "⋮"
};

Object.defineProperty(operators, "contains", {
  value: function(char) {
    return typeof operators[char] !== 'undefined';
  }
});

Object.defineProperty(operators, "regexp", {
  value: /([+\-*\/=~!^:.<>@,]|o[+x.])/
});


// Groupings
// =========

var groupings = {
  open: { "(:": "〈", "{:": "" },
  close: { ":)": "〉", ":}": "" }
};

Object.defineProperty(groupings.open, "regexp", {
  value: /([[〈]|[({]:?)/
});

Object.defineProperty(groupings.close, "regexp", {
  value: /([\]〉]|:?[)}])/
});

Object.defineProperty(groupings.open, "get", {
  value: function(str) { return groupings.open[str] || str; }
});

Object.defineProperty(groupings.close, "get", {
  value: function(str) { return groupings.close[str] || str; }
});

Object.freeze(groupings.open);
Object.freeze(groupings.close);


// Font
// ====

var fonts = {
  rm: "normal", bb: "bold", it: "italic", bbb: "double-struck",
  cc: "script", tt: "monospace", fr: "fraktur",
  sf: "sans-serif"
};

Object.defineProperty(fonts, "get", {
  value: function(str) { return fonts[str] || undefined; }
});

Object.defineProperty(fonts, "regexp", {
  value: new RegExp("(" + Object.keys(fonts).join('|') + ")")
});

module.exports = {
  identifiers: Object.freeze(identifiers),
  operators: Object.freeze(operators),
  groupings: Object.freeze(groupings),
  fonts: Object.freeze(fonts)
};
