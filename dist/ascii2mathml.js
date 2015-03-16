(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ascii2mathml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Identifiers
// ===========

var funs = ["sin", "cos", "tan", "csc", "sec", "cot", "sinh", "cosh", "tanh", "log", "ln", "det", "dim", "lim", "mod", "gcd", "lcm", "min", "max"];

var identifiers = {
  // Greek uppercase
  Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ",
  Pi: "Π", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
  // Greek lowercase
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ɛ",
  zeta: "ζ", eta: "η", theta: "θ", iota: "ι", kappa: "κ",
  lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ",
  sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", chi: "χ",
  psi: "ψ", omega: "ω",
  // Special symbols
  oo: "∞", "O/": "∅",
  // Blackboard
  CC: "ℂ", NN: "ℕ", QQ: "ℚ", RR: "ℝ", ZZ: "ℤ"
};

funs.forEach(function (fun) {
  identifiers[fun] = fun;
});

Object.defineProperty(identifiers, "contains", {
  value: function value(char) {
    return typeof identifiers[char] !== "undefined";
  }
});

Object.defineProperty(identifiers, "funs", {
  value: funs
});

Object.defineProperty(identifiers, "isfun", {
  value: function value(str) {
    return funs.indexOf(str) >= 0;
  }
});

// Operators
// =========

var operators = {
  // Operational
  "*": "·", "**": "∗", "***": "⋆", "//": "/",
  "|": "|", ":": ":", "'": "′", "''": "″", "'''": "‴", "''''": "⁗",
  xx: "×", "-:": "÷", "@": "∘", "o+": "⊕", ox: "⊗", "o.": "⊙",
  "!": "!", sum: "∑", prod: "∏", "^^": "∧", "^^^": "⋀",
  vv: "∨", vvv: "⋁", nn: "∩", nnn: "⋂", uu: "∪", uuu: "⋃",
  // Miscellaneous
  int: "∫", oint: "∮", dint: "∬", "+-": "±", del: "∂", grad: "∇",
  aleph: "ℵ", "/_": "∠", dimond: "⋄", square: "□", "|__": "⌊",
  "__|": "⌋", "|~": "⌈", "~|": "⌉",
  // Relational
  "=": "=", "!=": "≠", "<": "&lt;", ">": "&gt;", "<=": "≤", ">=": "≥",
  "-<": "≺", ">-": "≻", "in": "∈", "!in": "∉", sub: "⊂", sup: "⊃",
  sube: "⊆", supe: "⊇", "-=": "≡", "~~": "≈", prop: "∝",
  // Arrows
  "<-": "←", "->": "→", "=>": "⇒", "<=>": "⇔", "|->": "↦",
  uarr: "↑", darr: "↓", larr: "←", rarr: "→", harr: "↔",
  lArr: "⇐", rArr: "⇒", hArr: "⇔", iff: "⇔",
  // Punctuations
  ",": ",", ":.": "∴", "...": "…", cdots: "⋯", ddots: "⋱", vdots: "⋮",
  // Logical
  "if": "if", otherwise: "otherwise", and: "and", or: "or", not: "¬",
  AA: "∀", EE: "∃", "_|_": "⊥", TT: "⊤", "|--": "⊢", "|==": "⊨"
};

Object.defineProperty(operators, "contains", {
  value: function value(char) {
    return typeof operators[char] !== "undefined";
  }
});

Object.defineProperty(operators, "get", {
  value: function value(char) {
    return operators[char] || char;
  }
});

Object.defineProperty(operators, "regexp", {
  value: new RegExp("(" + Object.keys(operators).sort(function (a, b) {
    return b.length - a.length;
  }).map(regexpEscape).join("|") + "|[+-<=>|~¬±×÷ϐϑϒϕϰϱϴϵ϶؆؇؈‖′″‴⁀⁄⁒⁡-⁤" + "⁺-⁾₊-₎★☆♠♡♢♣♭♮♯﬩｡-ｨ" + "＋＜＝＞＼＾｜～￢￩￪￫￬" + "∀-⋿⨀-⫿⟀-⟥⦀-⦂" + "⦙-⧿⌁-⏿■-◿⬀-⯿" + "←-⇿⟰-⟿⤀-⥿⃐-⃯]" + ")")
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
  value: function value(str) {
    var match = groupings.open[str];
    return typeof match === "string" ? match : str;
  }
});

Object.defineProperty(groupings.close, "get", {
  value: function value(str) {
    var match = groupings.close[str];
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
  value: function value(str) {
    return fonts[str] || undefined;
  }
});

Object.defineProperty(fonts, "regexp", {
  value: new RegExp("(" + Object.keys(fonts).join("|") + ")")
});

// Accents
// =======

var accents = {
  hat: "^", bar: "‾", ul: "_", vec: "→", dot: "⋅", ddot: "⋅⋅"
};

Object.defineProperty(accents, "contains", {
  value: function value(str) {
    return Object.keys(accents).indexOf(str) >= 0;
  }
});

Object.defineProperty(accents, "get", {
  value: function value(str) {
    return accents[str] || undefined;
  }
});

Object.defineProperty(accents, "regexp", {
  value: new RegExp("(" + Object.keys(accents).join("|") + ")")
});

module.exports = {
  identifiers: Object.freeze(identifiers),
  operators: Object.freeze(operators),
  groupings: Object.freeze(groupings),
  fonts: Object.freeze(fonts),
  accents: Object.freeze(accents)
};

},{}],2:[function(require,module,exports){
"use strict";

var lexicon = require("./lexicon"),
    operators = lexicon.operators,
    groupings = lexicon.groupings,
    fonts = lexicon.fonts;

function splitNextOperator(str) {
  var re = new RegExp("^" + operators.regexp.source),
      match = re.exec(str),
      op = match[0];

  return [operators.get(op), str.slice(op.length)];
}

function isgroupStart(str) {
  var re = new RegExp("^" + groupings.open.regexp.source);
  return str.match(re);
}

function getgroupType(type, str) {
  var match = groupings[type].regexp.exec(str),
      ascii = match[0],
      grouptype = groupings[type].get(ascii);
  return grouptype;
}

function getopenType(str) {
  return getgroupType("open", str);
}
function getcloseType(str) {
  return getgroupType("close", str);
}

function isgroupable(str) {
  return str.match(/^[0-9A-Za-z+\-!]{2,}[ ,;]/);
}

function ismatrixInterior(str) {
  return isgroupStart(str) && splitNextGroup(str)[4].trim().startsWith(",");
}

var funcEndingRe = new RegExp("(" + lexicon.identifiers.funs.concat(Object.keys(lexicon.accents)).concat(["sqrt"]).sort(function (a, b) {
  return a.length - b.length;
}).join("|") + ")$");
function endsInFunc(str) {
  return str.match(funcEndingRe);
}

function splitNextWhitespace(str) {
  var match = str.match(/([\s,;]|$)/),
      head = str.slice(0, match.index),
      sep = match[0],
      tail = str.slice(match.index + 1),
      next = head,
      rest = sep + tail;
  if (endsInFunc(head) || head.match(/root(\d+(\.\d+)?$|[A-Za-z]$)/)) {
    var newsplit = splitNextWhitespace(tail);
    next += sep + newsplit[0];
    rest = newsplit[1];
  } else if (head.match(/root$/)) {
    var split1 = splitNextWhitespace(tail),
        split2 = splitNextWhitespace(split1[1].trimLeft());
    next += sep + split1[0] + " " + split2[0];
    rest = sep + split2[1];
  };
  return [next, rest];
}

function splitNextGroup(str) {
  /**
   Split the string into
   [before, open, group, close, after]
   */

  var openRE = new RegExp("^" + groupings.open.regexp.source),
      closeRE = new RegExp("^" + groupings.close.regexp.source);

  var start = undefined,
      stop = undefined,
      open = undefined,
      close = undefined,
      inners = 0,
      i = 0;

  while (i < str.length) {
    var rest = str.slice(i),
        openMatch = rest.match(openRE),
        closeMatch = rest.match(closeRE);

    if (openMatch) {
      if (typeof start !== "number") {
        start = i;
        open = openMatch[0];
      }
      inners += 1;
      i += openMatch[0].length;
    } else if (closeMatch) {
      inners -= 1;
      if (inners === 0) {
        close = closeMatch[0];
        stop = i + (close.length - 1);
        break;
      };
      i += closeMatch[0].length;
    } else i += 1;
  }

  if (!open) {
    return null;
  }return [start === 0 ? "" : str.slice(0, start), groupings.open.get(open), str.slice(start + open.length, stop - (close.length - 1)), groupings.close.get(close), str.slice(stop + 1)];
};

function isvertGroupStart(str) {
  var split = splitNextVert(str);
  return split && split[0] === "";
}

function splitNextVert(str) {
  function retval(start, stop, double) {
    return [start === 0 ? "" : str.slice(0, start), double ? "‖" : "|", str.slice(start + (double ? 2 : 1), stop), double ? "‖" : "|", str.slice(stop + (double ? 2 : 1))];
  }

  var start = str.indexOf("|"),
      stop = start + 1,
      rest = str.slice(start + 1);
  var double = rest.startsWith("|"),
      re = double ? /\|\|/ : /\|/;

  if (double) {
    rest = rest.slice(1);
    stop += 1;
  }

  if (rest.indexOf("|") === -1) {
    return null;
  }if (rest.match(/^\.?[_\^]/)) {
    return null;
  }while (rest.length > 0) {
    var split = splitNextGroup(rest),
        head = split ? split[0] : rest,
        tail = split ? split[4] : "";
    var match = re.exec(head);

    if (match) {
      return retval(start, stop + match.index, double);
    }stop += split.slice(0, -1).map(dot("length")).reduce(plus);
    // adjust for slim brackets
    if (split[1] === "") stop += 2;else if (split[1] === "〈") stop += 1;
    if (split[3] === "") stop += 2;else if (split[3] === "〉") stop += 1;

    rest = tail;
  }

  return null;
}

function dot(attr) {
  return function (obj) {
    return obj[attr];
  };
}

function plus(a, b) {
  return a + b;
}

// Fonts
// =====

function isfontCommand(str) {
  return isforcedIdentifier(str) || isforcedText(str);
}

function isforcedEl(reEnd) {
  var re = new RegExp("^" + fonts.regexp.source + "?" + reEnd);
  return function (str) {
    return re.exec(str);
  };
}

var isforcedIdentifier = isforcedEl("(`)\\w+`");
var isforcedText = isforcedEl("(\")");
function splitfont(ascii) {
  var typematch = isforcedIdentifier(ascii) || isforcedText(ascii),
      type = typematch && typematch[2],
      tagname = type === "\"" ? "mtext" : type === "`" ? "mi" : "";

  var start = ascii.indexOf(type),
      stop = start + 1 + ascii.slice(start + 1).indexOf(type),
      font = start > 0 ? fonts.get(ascii.slice(0, start)) : "";

  return {
    tagname: tagname,
    text: ascii.slice(start + 1, stop),
    font: font,
    rest: ascii.slice(stop + 1)
  };
}

var underEls = ["<mi>lim</mi>", "<mo>∑</mo>", "<mo>∏</mo>"];
function shouldGoUnder(el) {
  return underEls.indexOf(el) >= 0;
}

module.exports = {
  isgroupStart: isgroupStart,
  isgroupable: isgroupable,
  isvertGroupStart: isvertGroupStart,
  getopenType: getopenType,
  getcloseType: getcloseType,
  splitNextGroup: splitNextGroup,
  splitNextVert: splitNextVert,
  splitNextWhitespace: splitNextWhitespace,
  splitNextOperator: splitNextOperator,
  ismatrixInterior: ismatrixInterior,
  isfontCommand: isfontCommand,
  splitfont: splitfont,
  shouldGoUnder: shouldGoUnder
};

},{"./lexicon":1}],3:[function(require,module,exports){
"use strict";

var lexicon = require("./lib/lexicon"),
    identifiers = lexicon.identifiers,
    operators = lexicon.operators,
    groupings = lexicon.groupings;

var syntax = require("./lib/syntax"),
    isgroupStart = syntax.isgroupStart,
    getopenType = syntax.getopenType,
    getcloseType = syntax.getcloseType,
    ismatrixInterior = syntax.ismatrixInterior;

function tag(tagname) {
  return function fn(content, attr) {
    if (typeof content === "object") {
      // Curry
      return function (str) {
        return fn(str, content);
      };
    }
    if (typeof attr !== "object") {
      return "<" + tagname + ">" + content + "</" + tagname + ">";
    } else {
      var attrstr = Object.keys(attr).map(function (key) {
        return "" + key + "=\"" + attr[key] + "\"";
      }).join(" ");
      return "<" + tagname + " " + attrstr + ">" + content + "</" + tagname + ">";
    }
  };
}

var mi = tag("mi"),
    mn = tag("mn"),
    mo = tag("mo"),
    mfrac = tag("mfrac"),
    msup = tag("msup"),
    msub = tag("msub"),
    msubsup = tag("msubsup"),
    munder = tag("munder"),
    mover = tag("mover"),
    munderover = tag("munderover"),
    mrow = tag("mrow"),
    msqrt = tag("msqrt"),
    mroot = tag("mroot"),
    mfenced = tag("mfenced"),
    mtable = tag("mtable"),
    mtr = tag("mtr"),
    mtd = tag("mtd"),
    mtext = tag("mtext");

var rowsplit = splitby(",");
var colsplit = splitby(";");

function splitby(sep) {
  return function (str) {
    var split = [],
        inners = 0,
        index = 0;

    for (var i = 0; i < str.length; i += 1) {
      var char = str[i];
      if (char === sep && !str.slice(0, i).match(/\\(\\{2})*$/)) {
        if (inners === 0) {
          split.push(str.slice(index, i));
          index = i + 1;
        }
      } else if (char.match(groupings.open.regexp)) inners += 1;else if (char.match(groupings.close.regexp)) inners -= 1;
    }
    split.push(str.slice(index));
    return split;
  };
}

function ascii2mathml(asciimath, options) {
  options = typeof options === "object" ? options : {};
  options.annotate = options.annotate || false;
  options.bare = options.bare || false;
  options.display = options.display || "inline";
  options.standalone = options.standalone || false;

  var out = undefined;

  if (options.display && options.bare) {
    throw new Error("Can't display block without root element.");
  }

  var math = options.display !== "inline" ? function (expr) {
    return "<math display=\"" + options.display + "\">" + expr + "</math>";
  } : options && options.bare ? function (x) {
    return x;
  } : tag("math");

  if (options.annotate) {
    // Make sure the all presentational part is the first element
    var mathml = parsegroup(asciimath.trim());
    out = math("<semantics>" + mathml + "<annotation encoding=\"application/AsciiMath\">" + asciimath + "</annotation>" + "</semantics>");
  } else {
    out = math(parse(asciimath.trim(), ""));
  }

  if (options.standalone) {
    out = "<!DOCTYPE html><html><head><title>" + asciimath + "</title></head>" + "<body>" + out + "</body></html>";
  }

  return out;
}

function parse(_x, _x2, _x3, _x4) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var ascii = _x,
        mathml = _x2,
        space = _x3,
        grouped = _x4;
    spaces = spacecount = spaceel = next = el = rest = split = undefined;

    if (!ascii) {
      return mathml;
    }if (ascii.match(/^\s/)) {
      // Dont include the space it if there is a binary infix becoming
      // a prefix
      if (ascii.match(/^\s+(\/[^\/]|^[^\^]|_[^_|])/)) {
        _x = ascii.trim();
        _x2 = mathml;
        _x3 = true;
        _again = true;
        continue _function;
      }

      // Count the number of leading spaces
      var spaces = ascii.match(/^ +/),
          spacecount = spaces ? spaces[0].length : 0;
      if (spacecount > 1) {
        // spacewidth is a linear function of spacecount
        var spaceel = "<mspace width=\"" + (spacecount - 1) + "ex\" />";
        _x = ascii.trim();
        _x2 = mathml + spaceel;
        _x3 = true;
        _again = true;
        continue _function;
      };

      _x = ascii.trim();
      _x2 = mathml;
      _x3 = true;
      _again = true;
      continue _function;
    }

    var next = parseone(ascii, grouped),
        el = next[0],
        rest = next[1];

    // Binary infixes
    // --------------

    // ### Fraction
    if (rest.trimLeft().startsWith("/") || rest.trimLeft().startsWith("./")) {
      var split = splitNextFraction(el, rest);
      el = split[0];
      rest = split[1];
    }

    _x = rest;
    _x2 = mathml + el;
    _x3 = false;
    _again = true;
    continue _function;
  }
}

function parsegroup(ascii) {
  // Takes one asciiMath string and returns mathml in one group
  var mathml = parse(ascii, "", false, true);
  return mathml === getlastel(mathml) ? mathml : mrow(mathml);
}

function parseone(ascii, grouped, lastel) {
  /**
   Return a split of the first element parsed to MathML and the rest
   of the string unparsed.
   */

  // TODO: split this up into smaller more readable code

  if (!ascii) {
    return ["", ""];
  }var head = ascii[0],
      tail = ascii.slice(1);
  var el = undefined,
      rest = undefined,
      nextsymbol = head + (tail.match(/^[A-Za-z]+/) || "");

  // Roots
  // -----

  if (ascii.startsWith("sqrt")) {
    var _tail = ascii.slice(4).trim();
    var split = parseone(_tail, grouped);
    el = msqrt(removeSurroundingBrackets(split[0]));
    rest = split[1];
  } else if (ascii.startsWith("root")) {
    var _tail2 = ascii.slice(4).trimLeft();
    var one = parseone(_tail2, grouped),
        index = removeSurroundingBrackets(one[0]),
        tail2 = one[1].trimLeft();
    var two = parseone(tail2, grouped),
        base = removeSurroundingBrackets(two[0]);
    el = mroot(base + index);
    rest = two[1];
  }

  // Forced opperator
  // ----------------

  else if (head === "\\") {
    if (ascii[1].match(/[(\[]/)) {
      var _stop = findmatching(tail);
      el = mo(ascii.slice(2, _stop));
      rest = ascii.slice(_stop + 1);
    } else {
      el = mo(ascii[1]);
      rest = ascii.slice(2);
    }
  }

  // Accents
  // -------

  else if (lexicon.accents.contains(nextsymbol)) {
    var accent = lexicon.accents.get(nextsymbol),
        next = ascii.slice(nextsymbol.length).trimLeft();
    var under = accent === "_";
    var ijmatch = next.match(/^\s*\(?([ij])\)?/);
    if (!under && ijmatch) {
      // use non-dotted gyphs as to not clutter
      var letter = ijmatch[1];
      el = mover(mi(letter === "i" ? "ı" : "ȷ") + mo(accent, { accent: true }));
      rest = next.slice(ijmatch[0].length);
    } else {
      var split = parseone(next),
          tagfun = under ? munder : mover;
      el = tagfun(removeSurroundingBrackets(split[0]) + mo(accent, !under && { accent: true }));
      rest = split[1];
    }
  }

  // Whitespace
  // ----------

  else if (!grouped && syntax.isgroupable(ascii)) {
    // treat whitespace separated subexpressions as a group
    var split = syntax.splitNextWhitespace(ascii);
    el = parsegroup(split[0]);
    rest = split[1];
  }

  // Font Commands
  // -------------

  else if (syntax.isfontCommand(ascii)) {
    var split = syntax.splitfont(ascii);
    el = tag(split.tagname)(split.text, split.font && { mathvariant: split.font });
    rest = split.rest;
  }

  // Groupings
  // ---------

  else if (isgroupStart(ascii) || syntax.isvertGroupStart(ascii)) {
    var split = isgroupStart(ascii) ? syntax.splitNextGroup(ascii) : syntax.splitNextVert(ascii),
        _open = split[1],
        group = split[2],
        _close = split[3];
    rest = groupings.open.get(split[4]);
    var cols = colsplit(group);

    if (ismatrixInterior(group.trim())) {
      // ### Matrix

      var cases = _open === "{" && _close === "";
      var table = parsetable(group, cases && { columnalign: "center left" });
      el = mfenced(table, { open: _open, close: _close });
    } else if (cols.length > 1) {
      // ### Column vector

      if (cols.length === 2 && _open === "(" && _close === ")") {
        // #### Binomial Coefficient

        // Experimenting with the binomial coefficient
        // Perhaps I'll remove this later
        var binom = mfrac(cols.map(parsegroup).join(""), {
          linethickness: 0
        });
        el = mfenced(binom, { open: _open, close: _close });
      } else {
        // #### Single column vector

        var matrix = cols.map([mtr, mtd, parsegroup].reduce(compose)).join("");
        el = mfenced(mtable(matrix), { open: _open, close: _close });
      }
    } else {
      // ### A fenced group

      var rows = rowsplit(group),
          els = rows.map(parsegroup).join("");
      el = mfenced(els, { open: _open, close: _close });
    }
  } else if (head.match(/\d+/)) {
    // Number
    var number = ascii.match(/^\d+(\.\d+)?/)[0];
    el = mn(number);
    rest = tail.slice(number.length - 1);
    // return [el, rest];
  }

  // Operators
  // ---------

  else if (ascii.match(new RegExp("^" + operators.regexp.source)) && !identifiers.contains(nextsymbol)) {
    var split = syntax.splitNextOperator(ascii);
    var derivative = ascii.startsWith("'"),
        prefix = contains(["∂", "∇"], split[0]),
        stretchy = contains(["|"], split[0]);
    el = mo(split[0], derivative && { lspace: 0, rspace: 0 } || prefix && { rspace: 0 } || stretchy && { stretchy: true });
    rest = split[1];
  } else {
    // Perhaps a special identifier character
    if (identifiers.contains(nextsymbol)) {
      var symbol = identifiers[nextsymbol];

      // Uppercase greeks are roman font variant
      var _tag = symbol.match(/[\u0391-\u03A9\u2100-\u214F\u2200-\u22FF]/) ? mi({ mathvariant: "normal" }) : mi;
      el = _tag(symbol);
      rest = tail.slice(nextsymbol.length - 1);
    } else if (head === "O" && tail[0] === "/") {
      // The special case of the empty set
      // I suppose there is no dividing by the latin capital letter O
      el = mi(identifiers["O/"], { mathvariant: "normal" });
      rest = tail.slice(1);
    } else {
      // TODO: unicode literate throwaway
      el = mi(head);
      rest = tail;
    }
  }

  if (rest) {

    // ### Subscript
    if ((lastel ? !lastel.match(/m(sup|over)/) : true) && rest.trimLeft().startsWith("_") && !rest.trimLeft()[1].match(/[|_]/)) {
      var split = splitNextSubscript(el, rest);
      el = split[0];
      rest = split[1];
    }

    // ### Underscript
    else if (lastel !== "mover" && rest.trimLeft().startsWith("._") && !rest.trimLeft()[2].match(/[|_]/)) {
      var split = splitNextUnderscript(el, rest);
      el = split[0];
      rest = split[1];
    }

    // ### Superscript
    else if ((lastel ? !lastel.match(/m(sub|under)/) : true) && rest.trimLeft().startsWith("^") && rest.trimLeft[1] !== "^") {
      var split = splitNextSuperscript(el, rest);
      el = split[0];
      rest = split[1];
    }

    // ### Overscript
    else if (lastel !== "munder" && rest.trimLeft().startsWith(".^") && rest.trimLeft()[2] !== "^") {
      var split = splitNextOverscript(el, rest);
      el = split[0];
      rest = split[1];
    }
  }

  return [el, rest];
}

function splitNextSubscript(el, rest) {
  var next = parseone(rest.trimLeft().slice(1).trimLeft(), true, "msub"),
      sub = removeSurroundingBrackets(next[0]);
  var ml = undefined,
      ascii = next[1];

  // ### Supersubscript
  if (ascii && ascii.trimLeft().startsWith("^") && !ascii.trimLeft()[1] !== "^") {
    var next2 = parseone(ascii.trimLeft().slice(1).trimLeft(), true),
        sup = removeSurroundingBrackets(next2[0]),
        tagfun = syntax.shouldGoUnder(el) ? munderover : msubsup;
    ml = tagfun(el + sub + sup);
    ascii = next2[1];
  } else {
    var tagfun = syntax.shouldGoUnder(el) ? munder : msub;
    ml = tagfun(el + sub);
  }

  return [ml, ascii];
}

function splitNextSuperscript(el, rest) {
  var next = parseone(rest.trimLeft().slice(1).trimLeft(), true, "msup"),
      sup = removeSurroundingBrackets(next[0]);
  var ml = undefined,
      ascii = next[1];

  // ### Super- subscript
  if (ascii.trimLeft().startsWith("_") && !ascii.trimLeft()[1].match(/[|_]/)) {
    var next2 = parseone(ascii.trimLeft().slice(1).trimLeft(), true),
        sub = removeSurroundingBrackets(next2[0]),
        tagfun = syntax.shouldGoUnder(el) ? munderover : msubsup;
    ml = tagfun(el + sub + sup);
    ascii = next2[1];
  } else {
    var tagfun = syntax.shouldGoUnder(el) ? mover : msup;
    ml = tagfun(el + sup);
  }

  return [ml, ascii];
}

function splitNextUnderscript(el, rest) {
  var next = parseone(rest.trimLeft().slice(2).trimLeft(), true, "munder"),
      under = removeSurroundingBrackets(next[0]);
  var ml = undefined,
      ascii = next[1];

  // ### Under- overscript
  var overmatch = ascii.match(/^(\.?\^)[^\^]/);
  if (overmatch) {
    var next2 = parseone(ascii.trimLeft().slice(overmatch[1].length).trimLeft(), true),
        over = removeSurroundingBrackets(next2[0]);
    ml = munderover(el + under + over);
    ascii = next2[1];
  } else {
    ml = munder(el + under);
  }

  return [ml, ascii];
}

function splitNextOverscript(el, rest) {
  var next = parseone(rest.trimLeft().slice(2).trimLeft(), true, "mover"),
      over = removeSurroundingBrackets(next[0]);
  var ml = undefined,
      ascii = next[1];

  // ### Under- overscript
  var undermatch = ascii.match(/^(\.?_)[^_|]/);
  if (undermatch) {
    var next2 = parseone(ascii.trimLeft().slice(undermatch[1].length).trimLeft(), true),
        under = removeSurroundingBrackets(next2[0]);
    ml = munderover(el + under + over);
    ascii = next2[1];
  } else {
    ml = mover(el + over);
  }

  return [ml, ascii];
}

function splitNextFraction(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var el = _x,
        rest = _x2;
    bevelled = rem = next = split = ml = ascii = _split = _split2 = undefined;

    var bevelled = rest.trimLeft().startsWith("./");
    var rem = rest.trimLeft().slice(bevelled ? 2 : 1);
    var next = undefined;
    var split = parseone(rem),
        ml = undefined,
        ascii = undefined;
    if (rem.startsWith(" ")) {
      var _split = rem.trimLeft().split(" ");
      next = parsegroup(_split[0]);
      ascii = rem.trimLeft().slice(_split[0].length + 1);
    } else {
      var _split2 = parseone(rem);
      next = _split2[0];
      ascii = _split2[1];
    }
    ml = mfrac(removeSurroundingBrackets(el) + removeSurroundingBrackets(next), bevelled && { bevelled: true });

    if (ascii && ascii.trimLeft().startsWith("/") || ascii.trimLeft().startsWith("./")) {
      _x = ml;
      _x2 = ascii;
      _again = true;
      continue _function;
    }
    return [ml, ascii];
  }
}

function splitlast(mathml) {
  /**
   Return a pair of all but last eliment and the last eliment
   */
  var lastel = getlastel(mathml);
  var prewels = mathml.slice(0, mathml.lastIndexOf(lastel));

  return [prewels, lastel];
}

function removeSurroundingBrackets(mathml) {
  var inside = mathml.replace(/^<mfenced[^>]*>/, "").replace(/<\/mfenced>$/, "");
  if (splitlast(inside)[1] === inside) {
    return inside;
  } else {
    return mrow(inside);
  }
}

function getlastel(xmlstr) {
  // This breaks the linearity of the implimentation
  // optimation possible, perhaps an XML parser
  var tagname = xmlstr.match(/<\/(m[a-z]+)>$/)[1];

  var i = xmlstr.length - (tagname.length + 3),
      inners = 0;
  for (i; i >= 0; i--) {
    if (xmlstr.slice(i).startsWith("<" + tagname)) {
      if (inners === 0) break;
      inners -= 1;
    }
    if (xmlstr.slice(i - 2).startsWith("</" + tagname)) {
      inners += 1;
    }
  }

  return xmlstr.slice(i);
}

function parsetable(matrix, attrs) {
  var rows = rowsplit(matrix).map(function (el) {
    return el.trim().slice(1, -1);
  });

  return mtable(rows.map(parserow).join(""), attrs);
}

function parserow(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var row = _x,
        acc = _x2;
    split = undefined;

    acc = typeof acc === "string" ? acc : "";
    if (!row || row.length === 0) {
      return mtr(acc);
    }var split = parsecell(row.trim(), "");
    _x = split[1].trim();
    _x2 = acc + split[0];
    _again = true;
    continue _function;
  }
}

function parsecell(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var cell = _x,
        acc = _x2;
    split = undefined;

    if (!cell || cell.length === 0) {
      return [mtd(acc), ""];
    }if (cell[0] === ",") {
      return [mtd(acc), cell.slice(1).trim()];
    }var split = parseone(cell);
    _x = split[1].trim();
    _x2 = acc + split[0];
    _again = true;
    continue _function;
  }
}

function findmatching(str) {
  var open = str[0],
      close = open === "(" ? ")" : open === "[" ? "]" : str[0];

  var inners = 0,
      index = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var char = _step.value;

      index += 1;
      if (char === close) {
        inners -= 1;
        if (inners === 0) break;
      } else if (char === open) {
        inners += 1;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return index;
}

function contains(arr, el) {
  return arr.indexOf(el) >= 0;
}

function last(arr) {
  return arr.slice(-1)[0];
}

function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}

function idfun(x) {
  return x;
}

module.exports = ascii2mathml;

},{"./lib/lexicon":1,"./lib/syntax":2}]},{},[3])(3)
});