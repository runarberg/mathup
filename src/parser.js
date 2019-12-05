import syntax from "./syntax";
import { numbers, identifiers, operators, groupings, accents } from "./lexicon";

function tag(tagname) {
  return function fn(content, attr) {
    if (typeof content === "object") {
      // Curry
      return str => fn(str, content);
    }

    if (typeof attr !== "object") {
      return `<${tagname}>${content}</${tagname}>`;
    }

    const attrstr = Object.keys(attr)
      .map(key => `${key}="${attr[key]}"`)
      .join(" ");

    return `<${tagname} ${attrstr}>${content}</${tagname}>`;
  };
}

const mi = tag("mi");
const mn = tag("mn");
const mo = tag("mo");
const mfrac = tag("mfrac");
const msup = tag("msup");
const msub = tag("msub");
const msubsup = tag("msubsup");
const munder = tag("munder");
const mover = tag("mover");
const munderover = tag("munderover");
const menclose = tag("menclose");
const mrow = tag("mrow");
const msqrt = tag("msqrt");
const mroot = tag("mroot");
const mfenced = tag("mfenced");
const mtable = tag("mtable");
const mtr = tag("mtr");
const mtd = tag("mtd");

function parser(options) {
  const decimalMarkRE =
    options.decimalMark === "." ? "\\." : options.decimalMark;
  const numberRegexp = new RegExp(
    `^${numbers.digitRange}+(${decimalMarkRE}${numbers.digitRange}+)?`
  );
  const colsplit = splitby(options.colSep);
  const rowsplit = splitby(options.rowSep);
  const newlinesplit = splitby("\n");

  function splitby(sep) {
    return str => {
      const split = [];
      let inners = 0;
      let index = 0;

      for (let i = 0; i < str.length; i += 1) {
        const rest = str.slice(i);
        const char = str[i];
        if (rest.startsWith(sep) && !str.slice(0, i).match(/\\(\\{2})*$/)) {
          if (inners === 0) {
            split.push(str.slice(index, i));
            index = i + sep.length;
          }
        } else if (char.match(groupings.open.regexp)) {
          inners += 1;
        } else if (char.match(groupings.close.regexp)) {
          inners -= 1;
        }
      }

      split.push(str.slice(index));

      return split;
    };
  }

  const parse = function parse(ascii, mathml, space, grouped) {
    if (!ascii) {
      return mathml;
    }

    if (ascii.match(/^\s/)) {
      // Dont include the space it if there is a binary infix becoming
      // a prefix
      if (ascii.match(/^\s+(\/[^/]|^[^^]|_[^_|])/)) {
        return parse(ascii.trim(), mathml, true);
      }

      // Count the number of leading spaces
      const spaces = ascii.match(/^ +/);
      const spacecount = spaces ? spaces[0].length : 0;

      if (spacecount > 1) {
        // spacewidth is a linear function of spacecount
        const spaceel = `<mspace width="${spacecount - 1}ex" />`;

        return parse(ascii.trim(), mathml + spaceel, true);
      }

      return parse(ascii.trim(), mathml, true);
    }

    let [el, rest] = parseone(ascii, grouped);

    // ## Binary infixes ##

    // ### Fraction ###
    if (
      ((rest && rest.trimLeft().startsWith("/")) ||
        rest.trimLeft().startsWith("./")) &&
      !rest.trimLeft().match(/^\.?\/\//)
    ) {
      [el, rest] = splitNextFraction(el, rest);
    }

    return parse(rest, mathml + el, false);
  };

  function parsegroup(ascii) {
    // Takes one asciiMath string and returns mathml in one group
    if (ascii.trim().length === 0) {
      return "";
    }
    const mathml = parse(ascii, "", false, true);

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
    }

    let el;
    let rest;

    const head = ascii[0];
    const tail = ascii.slice(1);
    const nextsymbol = head + (tail.match(/^[A-Za-z]+/) || "");

    if (ascii.startsWith("sqrt")) {
      // ## Roots ##

      const split = parseone(ascii.slice(4).trim(), grouped);

      el = msqrt(split[0] ? removeSurroundingBrackets(split[0]) : mrow(""));
      [, rest] = split;
    } else if (ascii.startsWith("root")) {
      const one = parseone(ascii.slice(4).trimLeft(), grouped);
      const index = one[0] ? removeSurroundingBrackets(one[0]) : mrow("");
      const two = parseone(one[1].trimLeft(), grouped);
      const base = two[0] ? removeSurroundingBrackets(two[0]) : mrow("");

      el = mroot(base + index);
      [, rest] = two;
    } else if (ascii.startsWith("binom")) {
      const [, , group, , after] = syntax.splitNextGroup(ascii);
      const [a, b] = colsplit(group);
      const over = parsegroup(a.trim()) || mrow("");
      const under = parsegroup(b.trim()) || mrow("");

      el = mfenced(mfrac(over + under, { linethickness: 0 }), {
        open: "(",
        close: ")"
      });
      rest = after;
    } else if (head === "\\" && ascii.length > 1) {
      // ## Forced opperator ##

      if (ascii[1].match(/[([]/)) {
        const stop = findmatching(tail);
        el = mo(ascii.slice(2, stop));
        rest = ascii.slice(stop + 1);
      } else {
        el = mo(ascii[1]);
        rest = ascii.slice(2);
      }
    } else if (accents.contains(nextsymbol)) {
      // ## Accents ##

      const accent = accents.get(nextsymbol);
      const next = ascii.slice(nextsymbol.length).trimLeft();
      const ijmatch = next.match(/^\s*\(?([ij])\)?/);
      const split = parseone(next);

      switch (accent.type) {
        // ## Accents on top ##
        case "over":
          if (ijmatch) {
            // use non-dotted i and j glyphs as to not clutter
            el = mover(
              mi(ijmatch[1] === "i" ? "ı" : "ȷ") +
                mo(accent.accent, { accent: true })
            );
            rest = next.slice(ijmatch[0].length);
          } else {
            el = mover(
              removeSurroundingBrackets(split[0]) +
                mo(accent.accent, { accent: true })
            );
            [, rest] = split;
          }
          break;
        // ## Accents below ##
        case "under":
          el = munder(removeSurroundingBrackets(split[0]) + mo(accent.accent));
          [, rest] = split;
          break;
        // ## Enclosings
        case "enclose":
          el = menclose(removeSurroundingBrackets(split[0]), accent.attrs);
          [, rest] = split;
          break;
        default:
          throw new Error(`Invalid config for accent ${nextsymbol}`);
      }
    } else if (syntax.isfontCommand(ascii)) {
      // ## Font Commands ##

      const split = syntax.splitfont(ascii);

      el = tag(split.tagname)(
        split.text,
        split.font && { mathvariant: split.font }
      );
      rest = split.rest;
    } else if (groupings.complex.contains(nextsymbol)) {
      // ## Complex groupings ##

      const grouping = groupings.complex.get(nextsymbol);
      const next = ascii.slice(nextsymbol.length).trimLeft();
      const split = parseone(next);

      el = mfenced(removeSurroundingBrackets(split[0]), grouping);
      [, rest] = split;
    } else if (syntax.isgroupStart(ascii) || syntax.isvertGroupStart(ascii)) {
      // ## Groupings ##

      // eslint-disable-next-line prefer-const
      let [, open, group, close, after] = syntax.isgroupStart(ascii)
        ? syntax.splitNextGroup(ascii)
        : syntax.splitNextVert(ascii);

      rest = groupings.open.get(after);
      const rows = (() => {
        const lines = newlinesplit(group);
        return lines.length > 1 ? lines : rowsplit(group);
      })();

      if (
        syntax.ismatrixInterior(group.trim(), options.colSep, options.rowSep)
      ) {
        // ### Matrix ##

        if (group.trim().endsWith(options.colSep)) {
          // trailing row break
          group = group.trimRight().slice(0, -1);
        }

        const cases = open === "{" && close === "";
        const table = parsetable(
          group,
          cases && { columnalign: "center left" }
        );

        el = mfenced(table, { open, close });
      } else if (rows.length > 1) {
        // ### Column vector ###

        let vector = rows.map(colsplit);

        if (last(vector).length === 1 && last(vector)[0].match(/^\s*$/)) {
          // A trailing rowbreak
          vector = vector.slice(0, -1);
        }

        const matrix = vector
          .map(row => mtr(row.map(x => mtd(parsegroup(x))).join("")))
          .join("");

        el = mfenced(mtable(matrix), { open, close });
      } else {
        // ### A fenced group ###

        const cols = colsplit(group);
        const els = cols.map(parsegroup).join("");
        const attrs = { open, close };

        if (options.colSep !== ",") {
          attrs.separators = options.colSep;
        }
        el = mfenced(els, attrs);
      }
    } else if (!grouped && syntax.isgroupable(ascii, options)) {
      // ## Whitespace ##

      // treat whitespace separated subexpressions as a group
      const split = splitNextWhitespace(ascii);

      el = parsegroup(split[0]);
      [, rest] = split;
    } else if (numbers.isdigit(head)) {
      // ## Number ##

      const number = ascii.match(numberRegexp)[0];

      el = mn(number);
      rest = tail.slice(number.length - 1);
    } else if (ascii.match(/^#`[^`]+`/)) {
      // ## Forced number ##

      const number = ascii.match(/^#`([^`]+)`/)[1];
      el = mn(number);
      rest = ascii.slice(number.length + 3);
    } else if (
      ascii.match(new RegExp(`^${operators.regexp.source}`)) &&
      !identifiers.contains(nextsymbol)
    ) {
      // ## Operators ##

      const [op, next] = syntax.splitNextOperator(ascii);
      const derivative = ascii.startsWith("'");
      const prefix = contains(["∂", "∇"], op);
      const stretchy = contains(["|"], op);
      const mid = ascii.startsWith("| ");
      const attr = {};
      if (derivative) {
        attr.lspace = 0;
        attr.rspace = 0;
      }
      if (prefix) {
        attr.rspace = 0;
      }
      if (stretchy) {
        attr.stretchy = true;
      }
      if (mid) {
        attr.lspace = "veryverythickmathspace";
        attr.rspace = "veryverythickmathspace";
      }

      el = mo(op, !isempty(attr) && attr);
      rest = next;
    } else if (identifiers.contains(nextsymbol)) {
      // Perhaps a special identifier character
      const ident = identifiers[nextsymbol];

      // Uppercase greeks are roman font variant
      const uppercase = ident.match(
        /[\u0391-\u03A9\u2100-\u214F\u2200-\u22FF]/
      );
      el = uppercase ? mi(ident, { mathvariant: "normal" }) : mi(ident);
      rest = tail.slice(nextsymbol.length - 1);
    } else if (head === "O" && tail[0] === "/") {
      // The special case of the empty set. I suppose there is no
      // dividing by the latin capital letter O
      el = mi(identifiers["O/"], { mathvariant: "normal" });
      rest = tail.slice(1);
    } else {
      el = mi(head);
      rest = tail;
    }

    if (rest && rest.trimLeft().match(/\.?[\^_]/)) {
      if (
        (lastel ? !lastel.match(/m(sup|over)/) : true) &&
        rest.trim().startsWith("_") &&
        (rest.trim().length <= 1 || !rest.trim()[1].match(/[|_]/))
      ) {
        // ### Subscript ###
        [el, rest] = splitNextSubscript(el, rest);
      } else if (
        lastel !== "mover" &&
        rest.trim().startsWith("._") &&
        (rest.trim().length <= 2 || !rest.trim()[2].match(/[|_]/))
      ) {
        // ### Underscript ###
        [el, rest] = splitNextUnderscript(el, rest);
      } else if (
        (lastel ? !lastel.match(/m(sub|under)/) : true) &&
        rest.trim().startsWith("^") &&
        (rest.trim().length <= 1 || rest.trim()[1] !== "^")
      ) {
        // ### Superscript ###
        [el, rest] = splitNextSuperscript(el, rest);
      } else if (
        lastel !== "munder" &&
        rest.trim().startsWith(".^") &&
        (rest.trim().length <= 2 || rest.trim()[2] !== "^")
      ) {
        // ### Overscript ###
        [el, rest] = splitNextOverscript(el, rest);
      }
    }

    return [el, rest];
  }

  function splitNextSubscript(el, rest) {
    const next = parseone(
      rest
        .trim()
        .slice(1)
        .trim(),
      true,
      "msub"
    );
    const sub = next[0] ? removeSurroundingBrackets(next[0]) : mrow("");
    let ml;
    let ascii = next[1];

    // ### Supersubscript ###
    if (
      ascii &&
      ascii.trim().startsWith("^") &&
      (ascii.trim().length <= 1 || !ascii.trim()[1] !== "^")
    ) {
      const next2 = parseone(
        ascii
          .trim()
          .slice(1)
          .trim(),
        true
      );
      const sup = next2[0] ? removeSurroundingBrackets(next2[0]) : mrow("");
      const tagfun = syntax.shouldGoUnder(el) ? munderover : msubsup;
      ml = tagfun(el + sub + sup);
      [, ascii] = next2;
    } else {
      const tagfun = syntax.shouldGoUnder(el) ? munder : msub;
      ml = tagfun(el + sub);
    }

    return [ml, ascii];
  }

  function splitNextSuperscript(el, rest) {
    const next = parseone(
      rest
        .trim()
        .slice(1)
        .trim(),
      true,
      "msup"
    );
    const sup = next[0] ? removeSurroundingBrackets(next[0]) : mrow("");
    let ml;
    let ascii = next[1];

    // ### Super- subscript ###
    if (
      ascii.trim().startsWith("_") &&
      (ascii.trim().length <= 1 || !ascii.trim()[1].match(/[|_]/))
    ) {
      const next2 = parseone(
        ascii
          .trim()
          .slice(1)
          .trim(),
        true
      );
      const sub = next2[0] ? removeSurroundingBrackets(next2[0]) : mrow("");
      const tagfun = syntax.shouldGoUnder(el) ? munderover : msubsup;
      ml = tagfun(el + sub + sup);
      [, ascii] = next2;
    } else {
      const tagfun = syntax.shouldGoUnder(el) ? mover : msup;
      ml = tagfun(el + sup);
    }

    return [ml, ascii];
  }

  function splitNextUnderscript(el, rest) {
    const next = parseone(
      rest
        .trim()
        .slice(2)
        .trim(),
      true,
      "munder"
    );
    const under = next[0] ? removeSurroundingBrackets(next[0]) : mrow("");
    let ml;
    let ascii = next[1];

    // ### Under- overscript ###
    const overmatch = ascii.match(/^(\.?\^)[^^]/);
    if (overmatch) {
      const next2 = parseone(
        ascii
          .trim()
          .slice(overmatch[1].length)
          .trim(),
        true
      );
      const over = next2[0] ? removeSurroundingBrackets(next2[0]) : mrow("");
      ml = munderover(el + under + over);
      [, ascii] = next2;
    } else {
      ml = munder(el + under);
    }

    return [ml, ascii];
  }

  function splitNextOverscript(el, rest) {
    const next = parseone(
      rest
        .trim()
        .slice(2)
        .trim(),
      true,
      "mover"
    );
    const over = next[0] ? removeSurroundingBrackets(next[0]) : mrow("");
    let ml;
    let ascii = next[1];

    // ### Under- overscript ###
    const undermatch = ascii.match(/^(\.?_)[^_|]/);
    if (undermatch) {
      const next2 = parseone(
        ascii
          .trim()
          .slice(undermatch[1].length)
          .trim(),
        true
      );
      const under = next2[0] ? removeSurroundingBrackets(next2[0]) : mrow("");
      ml = munderover(el + under + over);
      [, ascii] = next2;
    } else {
      ml = mover(el + over);
    }

    return [ml, ascii];
  }

  function splitNextFraction(el, rest) {
    const bevelled = rest.trim().startsWith("./");
    const rem = rest.trim().slice(bevelled ? 2 : 1);
    let next;
    let ascii;

    if (rem.startsWith(" ")) {
      const split = rem.trim().split(" ");
      next = parsegroup(split[0]);
      ascii = rem.trimLeft().slice(split[0].length + 1);
    } else {
      [next, ascii] = parseone(rem);
    }
    next = next || mrow("");

    const ml = mfrac(
      removeSurroundingBrackets(el) + removeSurroundingBrackets(next),
      bevelled && { bevelled: true }
    );

    if (
      (ascii && ascii.trim().startsWith("/")) ||
      ascii.trim().startsWith("./")
    ) {
      return splitNextFraction(ml, ascii);
    }
    return [ml, ascii];
  }

  function splitNextWhitespace(str) {
    const re = new RegExp(`(\\s|${options.colSep}|${options.rowSep}|$)`);
    const match = str.match(re);
    const head = str.slice(0, match.index);
    const sep = match[0];
    const tail = str.slice(match.index + 1);

    let next = head;
    let rest = sep + tail;

    if (!syntax.isgroupStart(tail.trim()) && syntax.endsInFunc(head)) {
      const newsplit = splitNextWhitespace(tail);
      next += sep + newsplit[0];
      [, rest] = newsplit;
    } else if (head.match(/root$/)) {
      const split1 = splitNextWhitespace(tail);
      const split2 = splitNextWhitespace(split1[1].trimLeft());
      next += `${sep + split1[0]} ${split2[0]}`;
      rest = sep + split2[1];
    }
    return [next, rest];
  }

  function parsetable(matrix, attrs) {
    const rows = (() => {
      const lines = colsplit(matrix);
      return lines.length > 1 ? lines : newlinesplit(matrix);
    })().map(el => el.trim().slice(1, -1));

    return mtable(rows.map(row => parserow(row)).join(""), attrs);
  }

  function parserow(row, acc = "") {
    if (!row || row.length === 0) {
      return mtr(acc);
    }

    const [mathml, rest] = parsecell(row.trim(), "");
    return parserow(rest.trim(), acc + mathml);
  }

  function parsecell(cell, acc) {
    if (!cell || cell.length === 0) {
      return [mtd(acc), ""];
    }
    if (cell[0] === options.colSep) {
      return [mtd(acc), cell.slice(1).trim()];
    }

    const [mathml, rest] = parseone(cell);
    return parsecell(rest.trim(), acc + mathml);
  }

  return parse;
}

function splitlast(mathml) {
  /**
   Return a pair of all but last eliment and the last eliment
   */
  const lastel = getlastel(mathml);
  const prewels = mathml.slice(0, mathml.lastIndexOf(lastel));

  return [prewels, lastel];
}

function removeSurroundingBrackets(mathml) {
  const inside = mathml
    .replace(/^<mfenced[^>]*>/, "")
    .replace(/<\/mfenced>$/, "");
  if (splitlast(inside)[1] === inside) {
    return inside;
  }
  return mrow(inside);
}

function getlastel(xmlstr) {
  // This breaks the linearity of the implimentation
  // optimation possible, perhaps an XML parser
  const tagmatch = xmlstr.match(/<\/(m[a-z]+)>$/);
  if (!tagmatch) {
    const spacematch = xmlstr.match(/<mspace\s*([a-z]+="[a-z]")*\s*\?>/);
    if (spacematch) {
      const i = spacematch.match[0].length;
      return xmlstr.slice(i);
    }
    return "";
  }

  const tagname = tagmatch[1];

  let i = xmlstr.length - (tagname.length + 3);
  let inners = 0;
  for (i; i >= 0; i -= 1) {
    if (xmlstr.slice(i).startsWith(`<${tagname}`)) {
      if (inners === 0) {
        break;
      }
      inners -= 1;
    }
    if (xmlstr.slice(i - 2).startsWith(`</${tagname}`)) {
      inners += 1;
    }
  }

  return xmlstr.slice(i);
}

function findmatching(str) {
  const open = str[0];
  let close = open;

  if (open === "(") {
    close = ")";
  } else if (open === "[") {
    close = "]";
  }

  let inners = 0;
  let index = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str[i];
    index += 1;
    if (char === close) {
      inners -= 1;
      if (inners === 0) {
        break;
      }
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

parser.getlastel = getlastel;

export default parser;
