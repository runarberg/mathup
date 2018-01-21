// Numbers
// =======

const numbers = {};
const digitRange =
        "[\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE" +
        "\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9" +
        "\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9" +
        "\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2" +
        "\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59" +
        "\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C" +
        "\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819" +
        "\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99" +
        "\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59" +
        "\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u218B" +
        "\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD" +
        "\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195" +
        "\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF" +
        "零一二三四五六七八九十百千万億兆京垓𥝱秭穣溝澗正載割分厘毛糸忽微繊沙塵埃" +
        "\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835" +
        "\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9" +
        "\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]";
const digitRE = new RegExp(digitRange);

Object.defineProperties(numbers, {
  digitRange: { value: digitRange },
  digitRE: { value: digitRE },
  isdigit: { value: char => char.match(digitRE) }
});


// Identifiers
// ===========

const funs = ["sin", "cos", "tan", "csc", "sec", "cot", "sinh",
              "cosh", "tanh", "log", "ln", "det", "dim", "lim",
              "mod", "gcd", "lcm", "min", "max"];

const identifiers = {
  // Greek uppercase
  Gamma: "Γ",
  Delta: "Δ",
  Theta: "Θ",
  Lambda: "Λ",
  Xi: "Ξ",
  Pi: "Π",
  Sigma: "Σ",
  Phi: "Φ",
  Psi: "Ψ",
  Omega: "Ω",

  // Greek lowercase
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ɛ",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  pi: "π",
  rho: "ρ",
  sigma: "σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",

  // Special symbols
  "oo": "∞",
  "O/": "∅",

  // Blackboard
  CC: "ℂ",
  NN: "ℕ",
  QQ: "ℚ",
  RR: "ℝ",
  ZZ: "ℤ"
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

const operators = {
  // Operational
  "*": "·",
  "**": "∗",
  "***": "⋆",
  "//": "/",
  "|": "|",
  ":": ":",
  "'": "′",
  "''": "″",
  "'''": "‴",
  "''''": "⁗",
  "xx": "×",
  "-:": "÷",
  "@": "∘",
  "o+": "⊕",
  "ox": "⊗",
  "o.": "⊙",
  "!": "!",
  "sum": "∑",
  "prod": "∏",
  "^^": "∧",
  "^^^": "⋀",
  "vv": "∨",
  "vvv": "⋁",
  "nn": "∩",
  "nnn": "⋂",
  "uu": "∪",
  "uuu": "⋃",

  // Miscellaneous
  "int": "∫",
  "oint": "∮",
  "dint": "∬",
  "+-": "±",
  "del": "∂",
  "grad": "∇",
  "aleph": "ℵ",
  "/_": "∠",
  "diamond": "⋄",
  "square": "□",
  "|__": "⌊",
  "__|": "⌋",
  "|~": "⌈",
  "~|": "⌉",

  // Relational
  "=": "=",
  "!=": "≠",
  "<": "&lt;",
  ">": "&gt;",
  "<=": "≤",
  ">=": "≥",
  "-<": "≺",
  ">-": "≻",
  "in": "∈",
  "!in": "∉",
  "sub": "⊂",
  "sup": "⊃",
  "sube": "⊆",
  "supe": "⊇",
  "-=": "≡",
  "==": "≡",
  "~~": "≈",
  "prop": "∝",

  // Arrows
  "<-": "←",
  "->": "→",
  "=>": "⇒",
  "<=>": "⇔",
  "|->": "↦",
  "uarr": "↑",
  "darr": "↓",
  "larr": "←",
  "rarr": "→",
  "harr": "↔",
  "lArr": "⇐",
  "rArr": "⇒",
  "hArr": "⇔",
  "iff": "⇔",

  // Punctuations
  ",": ",",
  ":.": "∴",
  "...": "…",
  "cdots": "⋯",
  "ddots": "⋱",
  "vdots": "⋮",

  // Logical
  "if": "if",
  "otherwise": "otherwise",
  "and": "and",
  "or": "or",
  "not": "¬",
  "AA": "∀",
  "EE": "∃",
  "_|_": "⊥",
  "TT": "⊤",
  "|--": "⊢",
  "|==": "⊨"
};

Object.defineProperty(operators, "contains", {
  value: function(char) {
    return typeof operators[char] !== "undefined";
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
      .join("|") +
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

const groupings = {
  open: { "(:": "⟨", "{:": "" },
  close: { ":)": "⟩", ":}": "" },
  complex: {
    abs: {open: "|", close: "|"},
    floor: {open: "⌊", close: "⌋"},
    ceil: {open: "⌈", close: "⌉"},
    norm: {open: "∥", close: "∥"}
  }
};

Object.defineProperty(groupings.open, "regexp", {
  value: /([[⟦⟨⟪⟬⟮⦃⦅⦇⦉⦋⦍⦏⦑⦓⦕⦗]|[({]:?)/
});

Object.defineProperty(groupings.close, "regexp", {
  value: /([\]⟧⟩⟫⟭⟯⦄⦆⦈⦊⦌⦎⦐⦒⦔⦖⦘]|:?[)}])/
});

Object.defineProperty(groupings.open, "get", {
  value: function(str) {
    const match = groupings.open[str];
    return typeof match === "string" ? match : str;
  }
});

Object.defineProperty(groupings.close, "get", {
  value: function(str) {
    const match = groupings.close[str];
    return typeof match === "string" ? match : str;
  }
});

Object.defineProperty(groupings.complex, "contains", {
  value: function(str) {
    return Object.keys(groupings.complex).indexOf(str) >= 0;
  }
});

Object.defineProperty(groupings.complex, "get", {
  value: function(str) { return groupings.complex[str]; }
});

Object.freeze(groupings.open);
Object.freeze(groupings.close);
Object.freeze(groupings.complex);


// Font
// ====

const fonts = {
  rm: "normal",
  bf: "bold",
  it: "italic",
  bb: "double-struck",
  cc: "script",
  tt: "monospace",
  fr: "fraktur",
  sf: "sans-serif"
};

Object.defineProperty(fonts, "get", {
  value: function(str) { return fonts[str]; }
});

Object.defineProperty(fonts, "regexp", {
  value: new RegExp("(" + Object.keys(fonts).join("|") + ")")
});


// Accents
// =======

const accents = {
  hat: "^",
  bar: "‾",
  ul: "_",
  vec: "→",
  dot: "⋅",
  ddot: "⋅⋅",
  tilde: "˜"
};

Object.defineProperty(accents, "contains", {
  value: function(str) { return Object.keys(accents).indexOf(str) >= 0; }
});

Object.defineProperty(accents, "get", {
  value: function(str) { return accents[str]; }
});

Object.defineProperty(accents, "regexp", {
  value: new RegExp("(" + Object.keys(accents).join("|") + ")")
});


export {
  numbers,
  identifiers,
  operators,
  groupings,
  fonts,
  accents
};
