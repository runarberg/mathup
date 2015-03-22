"use strict";

require('./lib/polyfills');

var lexicon = require('./lib/lexicon'),
    identifiers = lexicon.identifiers,
    operators = lexicon.operators,
    groupings = lexicon.groupings;

var syntax = require('./lib/syntax'),
    isgroupStart = syntax.isgroupStart,
    getopenType = syntax.getopenType,
    getcloseType = syntax.getcloseType,
    ismatrixInterior = syntax.ismatrixInterior;


function tag(tagname) {
  return function fn(content, attr) {
    if (typeof content === 'object') {
      // Curry
      return function(str) { return fn(str, content); };
    }
    if (typeof attr !== 'object') {
      return `<${tagname}>${content}</${tagname}>`;
    } else {
      let attrstr = Object.keys(attr).map(function(key) {
        return `${key}="${attr[key]}"`;
      }).join(" ");
      return `<${tagname} ${attrstr}>${content}</${tagname}>`;
    }
  };
}

const mi = tag("mi"),
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


const rowsplit = splitby(',');
const colsplit = splitby(';');

function splitby(sep) {
  return function(str) {
    let split = [],
        inners = 0,
        index = 0;

    for (let i=0; i < str.length; i+=1) {
      let char = str[i];
      if (char === sep &&
          !str.slice(0,i).match(/\\(\\{2})*$/)) {
        if (inners === 0) {
          split.push(str.slice(index, i));
          index = i+1;
        }
      }
      else if (char.match(groupings.open.regexp)) inners += 1;
      else if (char.match(groupings.close.regexp)) inners -= 1;
    }
    split.push(str.slice(index));
    return split;
  };
}


function ascii2mathml(asciimath, options) {
  // Curry
  if (typeof asciimath === "object") {
    return function(str, options2) {
      let options = Object.assign({}, asciimath, options2);
      return ascii2mathml(str, options);
    };
  }
  options = typeof options === "object" ? options : {};
  options.annotate = options.annotate || false;
  options.bare = options.bare || false;
  options.display = options.display || "inline";
  options.standalone = options.standalone || false;

  let out;

  if (options.bare) {
    if (options.standalone) {
      throw new Error("Can't output a valid HTML without a root <math> element");
    }
    if (options.display && options.display.toLowerCase() === 'block') {
      throw new Error("Can't display block without root element.");
    }
  }

  let math = options.display !== "inline" ? function(expr) {
    return `<math display="${options.display}">${expr}</math>`;
  } :
      options && options.bare ? function(x) { return x; } :
      tag("math");

  if (options.annotate) {
    // Make sure the all presentational part is the first element
    let mathml = parsegroup(asciimath.trim());
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

function parse(ascii, mathml, space, grouped) {

  if (!ascii) return mathml;

  if (ascii.match(/^\s/)) {
    // Dont include the space it if there is a binary infix becoming
    // a prefix
    if (ascii.match(/^\s+(\/[^\/]|^[^\^]|_[^_|])/)) {
      return parse(ascii.trim(), mathml, true);
    }

    // Count the number of leading spaces
    let spaces = ascii.match(/^ +/),
        spacecount = spaces ? spaces[0].length : 0;
    if (spacecount > 1) {
      // spacewidth is a linear function of spacecount
      let spaceel = `<mspace width="${spacecount-1}ex" />`;
      return parse(ascii.trim(), mathml+spaceel, true);
    };

    return parse(ascii.trim(), mathml, true);
  }


  let next = parseone(ascii, grouped),
      el = next[0],
      rest = next[1];

  
  // Binary infixes
  // --------------

  
  // ### Fraction
  if (rest.trimLeft().startsWith('/') ||
      rest.trimLeft().startsWith('./')) {
    let split = splitNextFraction(el, rest);
    el = split[0];
    rest = split[1];
  }


  return parse(rest, mathml + el, false);
}


function parsegroup(ascii) {
  // Takes one asciiMath string and returns mathml in one group
  let mathml = parse(ascii, "", false, true);
  return mathml === getlastel(mathml) ? mathml : mrow(mathml);
}


function parseone(ascii, grouped, lastel) {
  /**
   Return a split of the first element parsed to MathML and the rest
   of the string unparsed.
   */

  // TODO: split this up into smaller more readable code

  if (!ascii) return ["", ""];

  let head = ascii[0],
      tail = ascii.slice(1);
  let el,
      rest,
      nextsymbol = head + (tail.match(/^[A-Za-z]+/) || "");


  // Roots
  // -----

  if (ascii.startsWith('sqrt')) {
    let tail = ascii.slice(4).trim();
    let split = parseone(tail, grouped);
    el = msqrt(removeSurroundingBrackets(split[0]));
    rest = split[1];
  }

  else if (ascii.startsWith('root')) {
    let tail = ascii.slice(4).trimLeft();
    let one = parseone(tail, grouped),
        index = removeSurroundingBrackets(one[0]),
        tail2 = one[1].trimLeft();
    let two = parseone(tail2, grouped),
        base = removeSurroundingBrackets(two[0]);
    el = mroot(base + index);
    rest = two[1];
  }

  
  // Forced opperator
  // ----------------
  
  else if (head === "\\") {
    if (ascii[1].match(/[(\[]/)) {
      let stop = findmatching(tail);
      el = mo(ascii.slice(2, stop));
      rest = ascii.slice(stop+1);
    } else {
      el = mo(ascii[1]);
      rest = ascii.slice(2);
    }
  }


  // Accents
  // -------

  else if (lexicon.accents.contains(nextsymbol)) {
    let accent = lexicon.accents.get(nextsymbol),
        next = ascii.slice(nextsymbol.length).trimLeft();
    let under = accent === "_";
    let ijmatch = next.match(/^\s*\(?([ij])\)?/);
    if (!under && ijmatch) {
      // use non-dotted gyphs as to not clutter
      let letter = ijmatch[1];
      el = mover(mi(letter === 'i' ? 'ı' : 'ȷ') +
                 mo(accent, {accent: true}));
      rest = next.slice(ijmatch[0].length);
    } else {
      let split = parseone(next),
          tagfun = under ? munder : mover;
      el = tagfun(removeSurroundingBrackets(split[0])
                  + mo(accent, !under && {accent: true}));
      rest = split[1];
    }
  }

  // Whitespace
  // ----------

  else if (!grouped && syntax.isgroupable(ascii)) {
    // treat whitespace separated subexpressions as a group
    let split = syntax.splitNextWhitespace(ascii);
    el = parsegroup(split[0]);
    rest = split[1];
  }

  // Font Commands
  // -------------

  else if (syntax.isfontCommand(ascii)) {
    let split = syntax.splitfont(ascii);
    el = tag(split.tagname)(split.text,
                            split.font && {mathvariant: split.font});
    rest = split.rest;
  }

  // Groupings
  // ---------

  else if (isgroupStart(ascii) || syntax.isvertGroupStart(ascii)) {
    let split = isgroupStart(ascii) ?
          syntax.splitNextGroup(ascii) : syntax.splitNextVert(ascii),
        open = split[1],
        group = split[2],
        close = split[3];
    rest = groupings.open.get(split[4]);
    let cols = colsplit(group);

    if (ismatrixInterior(group.trim())) {
      // ### Matrix

      let cases = open === "{" && close === "";
      let table = parsetable(group,
                             cases && {columnalign: "center left"});
      el = mfenced(table, {open: open, close: close});

    } else if (cols.length > 1) {
      // ### Column vector

      if (cols.length === 2 && open === '(' && close ===')') {
        // #### Binomial Coefficient

        // Experimenting with the binomial coefficient
        // Perhaps I'll remove this later
        let binom = mfrac(cols.map(parsegroup).join(""), {
          linethickness: 0
        });
        el = mfenced(binom, {open: open, close: close});
        
      } else {
        // #### Single column vector

        let matrix = cols.map([mtr, mtd, parsegroup].reduce(compose)).join('');
        el = mfenced(mtable(matrix), {open: open, close: close});
      }

    } else {
      // ### A fenced group

      let rows = rowsplit(group),
          els = rows.map(parsegroup).join("");
      el = mfenced(els, {open: open, close: close});
    }

  }

  else if (head.match(/\d+/)) {
    // Number
    let number = ascii.match(/^\d+(\.\d+)?/)[0];
    el = mn(number);
    rest = tail.slice(number.length-1);
    // return [el, rest];
  }

  // Operators
  // ---------

  else if (ascii.match(new RegExp("^"+operators.regexp.source)) &&
           !identifiers.contains(nextsymbol)) {
    let split = syntax.splitNextOperator(ascii);
    let derivative = ascii.startsWith("'"),
        prefix = contains(["∂", "∇"], split[0]),
        stretchy = contains(["|"], split[0]),
        mid = ascii.startsWith("| ");
    let attr = {};
    if (derivative) { attr.lspace = 0; attr.rspace = 0; }
    if (prefix) attr.rspace = 0;
    if (stretchy) attr.stretchy = true;
    if (mid) {
      attr.lspace = "veryverythickmathspace";
      attr.rspace = attr.lspace = "veryverythickmathspace";
    }
    el = mo(split[0], !isempty(attr) && attr);
    rest = split[1];

  }

  else {
    // Perhaps a special identifier character
    if (identifiers.contains(nextsymbol)) {
      let symbol = identifiers[nextsymbol];

      // Uppercase greeks are roman font variant
      let tag = symbol.match(/[\u0391-\u03A9\u2100-\u214F\u2200-\u22FF]/) ?
            mi({mathvariant: "normal"}) : mi ;
      el = tag(symbol);
      rest = tail.slice(nextsymbol.length-1);


    } else if (head === 'O' && tail[0] === '/') {
      // The special case of the empty set
      // I suppose there is no dividing by the latin capital letter O
      el = mi(identifiers["O/"], {mathvariant: "normal"});
      rest = tail.slice(1);
    }

    else {
      // TODO: unicode literate throwaway
      el = mi(head);
      rest = tail;
    }
  }

  if (rest) {

    // ### Subscript
    if ((lastel ? !lastel.match(/m(sup|over)/) : true) &&
        rest.trimLeft().startsWith('_') &&
        !rest.trimLeft()[1].match(/[|_]/)) {
      let split = splitNextSubscript(el, rest);
      el = split[0];
      rest = split[1];
    }

    // ### Underscript
    else if (lastel !== "mover" &&
             rest.trimLeft().startsWith('._') &&
             !rest.trimLeft()[2].match(/[|_]/)) {
      let split = splitNextUnderscript(el, rest);
      el = split[0];
      rest = split[1];
    }

    // ### Superscript
    else if ((lastel ? !lastel.match(/m(sub|under)/) : true) &&
             rest.trimLeft().startsWith('^') &&
             rest.trimLeft[1] !== '^') {
      let split = splitNextSuperscript(el, rest);
      el = split[0];
      rest = split[1];
    }

    // ### Overscript
    else if (lastel !== "munder" &&
             rest.trimLeft().startsWith('.^') &&
             rest.trimLeft()[2] !== '^') {
      let split = splitNextOverscript(el, rest);
      el = split[0];
      rest = split[1];
    }
  }

  return [el, rest];
}


function splitNextSubscript(el, rest) {
  let next = parseone(rest.trimLeft().slice(1).trimLeft(),
                      true, "msub"),
      sub = removeSurroundingBrackets(next[0]);
  let ml,
      ascii = next[1];
  
  // ### Supersubscript
  if (ascii && ascii.trimLeft().startsWith('^') &&
      !ascii.trimLeft()[1] !== '^') {
    let next2 = parseone(ascii.trimLeft().slice(1).trimLeft(), true),
        sup = removeSurroundingBrackets(next2[0]),
        tagfun = syntax.shouldGoUnder(el) ? munderover : msubsup;
    ml = tagfun(el + sub + sup);
    ascii = next2[1];
  } else {
    let tagfun = syntax.shouldGoUnder(el) ? munder : msub;
    ml = tagfun(el + sub);
  }

  return [ml, ascii];
}

function splitNextSuperscript(el, rest) {
  let next = parseone(rest.trimLeft().slice(1).trimLeft(),
                      true, "msup"),
      sup = removeSurroundingBrackets(next[0]);
  let ml,
      ascii = next[1];

  // ### Super- subscript
  if (ascii.trimLeft().startsWith('_') &&
      !ascii.trimLeft()[1].match(/[|_]/)) {
    let next2 = parseone(ascii.trimLeft().slice(1).trimLeft(), true),
        sub = removeSurroundingBrackets(next2[0]),
        tagfun = syntax.shouldGoUnder(el) ? munderover : msubsup;
    ml = tagfun(el + sub + sup);
    ascii = next2[1];
  } else {
    let tagfun = syntax.shouldGoUnder(el) ? mover : msup;
    ml = tagfun(el + sup);
  }

  return [ml, ascii];
}


function splitNextUnderscript(el, rest) {
  let next = parseone(rest.trimLeft().slice(2).trimLeft(),
                      true, "munder"),
      under = removeSurroundingBrackets(next[0]);
  let ml,
      ascii = next[1];

  // ### Under- overscript
  let overmatch = ascii.match(/^(\.?\^)[^\^]/);
  if (overmatch) {
    let next2 = parseone(ascii.trimLeft()
                         .slice(overmatch[1].length)
                         .trimLeft(), true),
        over = removeSurroundingBrackets(next2[0]);
    ml = munderover(el + under + over);
    ascii = next2[1];
  } else {
    ml = munder(el + under);
  }

  return [ml, ascii];
}

function splitNextOverscript(el, rest) {
  let next = parseone(rest.trimLeft().slice(2).trimLeft(),
                      true, "mover"),
      over = removeSurroundingBrackets(next[0]);
  let ml,
      ascii = next[1];

  // ### Under- overscript
  let undermatch = ascii.match(/^(\.?_)[^_|]/);
  if (undermatch) {
    let next2 = parseone(ascii.trimLeft()
                         .slice(undermatch[1].length)
                         .trimLeft(), true),
        under = removeSurroundingBrackets(next2[0]);
    ml = munderover(el + under + over);
    ascii = next2[1];
  } else {
    ml = mover(el + over);
  }

  return [ml, ascii];
}


function splitNextFraction(el, rest) {
  let bevelled = rest.trimLeft().startsWith('./');
  let rem = rest.trimLeft().slice(bevelled ? 2 : 1);
  let next;
  let split = parseone(rem),
      ml,
      ascii;
  if (rem.startsWith(' ')) {
    let split = rem.trimLeft().split(' ');
    next = parsegroup(split[0]);
    ascii = rem.trimLeft().slice(split[0].length+1);
  } else {
    let split = parseone(rem);
    next = split[0];
    ascii = split[1];
  }
  ml = mfrac(removeSurroundingBrackets(el) +
             removeSurroundingBrackets(next),
             bevelled && {bevelled: true});

  if (ascii && ascii.trimLeft().startsWith('/') ||
      ascii.trimLeft().startsWith('./')) {
    return splitNextFraction(ml, ascii);
  }
  return [ml, ascii];
}


function splitlast(mathml) {
  /**
   Return a pair of all but last eliment and the last eliment
   */
  let lastel = getlastel(mathml);
  let prewels = mathml.slice(0, mathml.lastIndexOf(lastel));

  return [prewels, lastel];
}


function removeSurroundingBrackets(mathml) {
  let inside = mathml.replace(/^<mfenced[^>]*>/, "")
        .replace(/<\/mfenced>$/, "");
  if (splitlast(inside)[1] === inside) return inside;
  else return mrow(inside);
}


function getlastel(xmlstr) {
  // This breaks the linearity of the implimentation
  // optimation possible, perhaps an XML parser
  let tagname = xmlstr.match(/<\/(m[a-z]+)>$/)[1];

  let i = xmlstr.length-(tagname.length+3),
      inners = 0;
  for (i; i >= 0; i--) {
    if (xmlstr.slice(i).startsWith("<"+tagname)) {
      if (inners === 0) break;
      inners -= 1;
    }
    if (xmlstr.slice(i-2).startsWith("</"+tagname)) {
      inners += 1;
    }
  }

  return xmlstr.slice(i);
}

function parsetable(matrix, attrs) {
  let rows = rowsplit(matrix)
        .map(function(el) { return el.trim().slice(1, -1); });

  return mtable(rows.map(parserow).join(''), attrs);
}

function parserow(row, acc) {
  acc = typeof acc === 'string' ? acc : "";
  if (!row || row.length === 0) return mtr(acc);

  let split = parsecell(row.trim(), "");
  return parserow(split[1].trim(), acc+split[0]);
}

function parsecell(cell, acc) {
  if (!cell || cell.length === 0) return [mtd(acc), ""];
  if (cell[0] === ',') return [mtd(acc), cell.slice(1).trim()];

  let split = parseone(cell);
  return parsecell(split[1].trim(), acc+split[0]);
}


function findmatching(str) {
  let open = str[0],
      close = open === '(' ? ')' :
        open === '[' ? ']' :
        str[0];

  let inners = 0,
      index = 0;
  for (let i = 0; i < str.length; i +=1) {
    let char = str[i];
    index += 1;
    if (char === close) {
      inners -= 1;
      if (inners === 0) break;
    } else if (char === open) {
      inners += 1;
    }
  }
  return index;
}

function isempty(obj) {
  return Object.keys(obj).length === 0;
}

function contains(arr, el) {
  return arr.indexOf(el) >= 0;
}

function last(arr) {
  return arr.slice(-1)[0];
}

function compose(f, g) {
  return function(x) { return f(g(x)); };
}


function idfun(x) { return x; }

module.exports = ascii2mathml;
