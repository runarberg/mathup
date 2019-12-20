import {
  accents,
  identifiers,
  operators,
  groupings,
  fonts,
} from "./lexicon.js";

function splitNextOperator(str) {
  const re = new RegExp(`^${operators.regexp.source}`);
  const match = re.exec(str);
  const op = match[0];

  return [operators.get(op), str.slice(op.length)];
}

function isgroupStart(str) {
  const re = new RegExp(`^${groupings.open.regexp.source}`);
  return str.match(re);
}

function isgroupable(str, options) {
  const re = new RegExp(
    `^[0-9A-Za-z+\\-!]{2,}(\\s|${options.colSep}|${options.rowSep})`,
  );
  return str.match(re);
}

function ismatrixInterior(str, colSep, rowSep) {
  if (!isgroupStart(str)) {
    return false;
  }

  let rest = splitNextGroup(str)[4];

  if (
    !(
      rest.trim().startsWith(colSep) ||
      (rest.match(/^\s*\n/) && isgroupStart(rest.trim()))
    )
  ) {
    return false;
  }

  // Make sure we are building the matrix with parenthesis, as opposed
  // to rowSeps.
  while (rest && rest.trim()) {
    [, , , , rest] = splitNextGroup(rest) || [];

    if (rest && (rest.startsWith(rowSep) || rest.match(/^\s*\n/))) {
      // `rowSep` delimited matrices are handled elsewhere.
      return false;
    }
  }

  return true;
}

const funcEndingRe = new RegExp(
  `(${identifiers.funs
    .concat(Object.keys(accents))
    .concat(["sqrt"])
    .sort((a, b) => a.length - b.length)
    .join("|")})$`,
);

function endsInFunc(str) {
  return str.match(funcEndingRe);
}

function splitNextGroup(str) {
  /** Split the string into `[before, open, group, close, after]` */

  const openRE = new RegExp(`^${groupings.open.regexp.source}`);
  const closeRE = new RegExp(`^${groupings.close.regexp.source}`);

  let start;
  let stop;
  let open;
  let close;
  let inners = 0;
  let i = 0;

  while (i < str.length) {
    const rest = str.slice(i);
    const openMatch = rest.match(openRE);
    const closeMatch = rest.match(closeRE);

    if (openMatch) {
      if (typeof start !== "number") {
        start = i;
        [open] = openMatch;
      }
      inners += 1;
      i += openMatch[0].length;
    } else if (closeMatch) {
      inners -= 1;
      if (inners === 0) {
        [close] = closeMatch;
        stop = i + (close.length - 1);
        break;
      }
      i += closeMatch[0].length;
    } else {
      i += 1;
    }
  }

  if (!open) {
    return null;
  }

  return [
    start === 0 ? "" : str.slice(0, start),
    groupings.open.get(open),
    str.slice(
      start + open.length,
      close ? stop - (close.length - 1) : str.length,
    ),
    close ? groupings.close.get(close) : "",
    stop ? str.slice(stop + 1) : "",
  ];
}

function isvertGroupStart(str) {
  if (!str.startsWith("|")) {
    return false;
  }
  const split = splitNextVert(str);

  return split && split[0] === "";
}

function splitNextVert(str) {
  function retval(start, stop, double) {
    return [
      start === 0 ? "" : str.slice(0, start),
      double ? "‖" : "|",
      str.slice(start + (double ? 2 : 1), stop),
      double ? "‖" : "|",
      str.slice(stop + (double ? 2 : 1)),
    ];
  }

  const start = str.indexOf("|");
  let stop = start + 1;
  let rest = str.slice(start + 1);
  const double = rest.startsWith("|");
  const re = double ? /\|\|/ : /\|/;

  if (double) {
    rest = rest.slice(1);
    stop += 1;
  }

  if (rest.indexOf("|") === -1) {
    return null;
  }
  if (rest.match(/^\.?[_^]/)) {
    return null;
  }

  while (rest.length > 0) {
    const split = splitNextGroup(rest);
    const head = split ? split[0] : rest;
    const tail = split ? split[4] : "";
    const match = re.exec(head);

    if (match) {
      return retval(start, stop + match.index, double);
    }

    stop += split
      .slice(0, -1)
      .map(dot("length"))
      .reduce(plus);
    // adjust for slim brackets
    if (split[1] === "") {
      stop += 2;
    } else if (split[1] === "〈") {
      stop += 1;
    }
    if (split[3] === "") {
      stop += 2;
    } else if (split[3] === "〉") {
      stop += 1;
    }

    rest = tail;
  }

  return null;
}

function dot(attr) {
  return obj => obj[attr];
}

function plus(a, b) {
  return a + b;
}

// Fonts
// =====

function isforcedEl(reEnd) {
  const re = new RegExp(`^(${fonts.regexp.source} ?)?${reEnd}`);
  return str => re.exec(str);
}

const isforcedIdentifier = isforcedEl("(`)\\w+`");
const isforcedText = isforcedEl('(")');

function isfontCommand(str) {
  return isforcedIdentifier(str) || isforcedText(str);
}

function splitfont(ascii) {
  const typematch = isforcedIdentifier(ascii) || isforcedText(ascii);
  const font = typematch && typematch[2];
  const type = typematch && typematch[3];
  let tagname = "";

  if (type === '"') {
    tagname = "mtext";
  } else if (type === "`") {
    tagname = "mi";
  }

  const start = ascii.indexOf(type);
  const stop = start + 1 + ascii.slice(start + 1).indexOf(type);
  const fontvariant = start > 0 ? fonts.get(font) : "";

  return {
    tagname,
    text: ascii.slice(start + 1, stop),
    font: fontvariant,
    rest: ascii.slice(stop + 1),
  };
}

const underEls = ["<mi>lim</mi>", "<mo>∑</mo>", "<mo>∏</mo>"];
function shouldGoUnder(el) {
  return underEls.indexOf(el) >= 0;
}

const syntax = {
  endsInFunc,
  isgroupStart,
  isgroupable,
  isvertGroupStart,
  splitNextGroup,
  splitNextVert,
  splitNextOperator,
  ismatrixInterior,
  isfontCommand,
  splitfont,
  shouldGoUnder,
};

export default syntax;
