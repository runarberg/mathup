import {accents, identifiers, operators, groupings, fonts} from "./lexicon";

function splitNextOperator(str) {
  const re = new RegExp("^" + operators.regexp.source),
        match = re.exec(str),
        op = match[0];

  return [operators.get(op), str.slice(op.length)];
}


function isgroupStart(str) {
  let re = new RegExp("^" + groupings.open.regexp.source);
  return str.match(re);
}


function isgroupable(str, options) {
  let re = new RegExp(
    `^[0-9A-Za-z+\\-!]{2,}(\\s|${options.colSep}|${options.rowSep})`
  );
  return str.match(re);
}

function ismatrixInterior(str, colSep, rowSep) {
  if (!isgroupStart(str)) {
    return false;
  }

  let rest = splitNextGroup(str)[4];

  if (
    !(rest.trim().startsWith(colSep) ||
      rest.match(/^\s*\n/) &&
      isgroupStart(rest.trim()))
  ) {
    return false;
  }

  // Make sure we are building the matrix with parenthesis, as opposed
  // to rowSeps.
  while (rest && rest.trim()) {
    rest = (splitNextGroup(rest) || [])[4];

    if (rest && (rest.startsWith(rowSep) || rest.match(/^\s*\n/))) {
      // `rowSep` delimited matrices are handled elsewhere.
      return false;
    }
  }

  return true;
}

const funcEndingRe = new RegExp(
  "(" +
    identifiers.funs
    .concat(Object.keys(accents))
    .concat(["sqrt"])
    .sort(function(a, b) {
      return a.length - b.length;
    }).join("|") +
    ")$");

function endsInFunc(str) {
  return str.match(funcEndingRe);
}

function splitNextGroup(str) {
  /** Split the string into `[before, open, group, close, after]` */

  const openRE = new RegExp("^" + groupings.open.regexp.source),
        closeRE = new RegExp("^" + groupings.close.regexp.source);

  let start,
      stop,
      open,
      close,
      inners = 0,
      i = 0;

  while (i < str.length) {
    let rest = str.slice(i),
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
      }
      i += closeMatch[0].length;

    } else {
      i += 1;
    }
  }

  if (!open) {
    return null;
  }

  return [start === 0 ? "" : str.slice(0, start),
          groupings.open.get(open),
          str.slice(start + open.length,
                    close ? stop - (close.length - 1) : str.length),
          close ? groupings.close.get(close) : "",
          stop ? str.slice(stop + 1) : ""];
}

function isvertGroupStart(str) {
  if (!str.startsWith("|")) {
    return false;
  }
  let split = splitNextVert(str);

  return split && split[0] === "";
}

function splitNextVert(str) {
  function retval(start, stop, double) {
    return [start === 0 ? "" : str.slice(0, start),
            double ? "‖" : "|",
            str.slice(start + (double ? 2 : 1), stop),
            double ? "‖" : "|",
            str.slice(stop + (double ? 2 : 1))];
  }

  let start = str.indexOf("|"),
      stop = start + 1,
      rest = str.slice(start + 1),
      double = rest.startsWith("|"),
      re = double ? /\|\|/ : /\|/;

  if (double) {
    rest = rest.slice(1);
    stop += 1;
  }

  if (rest.indexOf("|") === -1) {
    return null;
  }
  if (rest.match(/^\.?[_\^]/)) {
    return null;
  }

  while (rest.length > 0) {
    let split = splitNextGroup(rest),
        head = split ? split[0] : rest,
        tail = split ? split[4] : "",
        match = re.exec(head);

    if (match) {
      return retval(start, stop + match.index, double);
    }

    stop += split.slice(0, -1).map(dot("length")).reduce(plus);
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

function plus(a, b) { return a + b; }


// Fonts
// =====

function isforcedEl(reEnd) {
  let re = new RegExp("^(" + fonts.regexp.source + " ?)?" + reEnd);
  return str => re.exec(str);
}

const isforcedIdentifier = isforcedEl("(`)\\w+`");
const isforcedText = isforcedEl('(")');

function isfontCommand(str) {
  return isforcedIdentifier(str) || isforcedText(str);
}

function splitfont(ascii) {
  let typematch = isforcedIdentifier(ascii) || isforcedText(ascii),
      font = typematch && typematch[2],
      type = typematch && typematch[3],
      tagname = type === '"' ? "mtext" :
        type === "`" ? "mi" :
        "";

  let start = ascii.indexOf(type),
      stop = start + 1 + ascii.slice(start + 1).indexOf(type),
      fontvariant = start > 0 ? fonts.get(font) : "";

  return {
    tagname: tagname,
    text: ascii.slice(start + 1, stop),
    font: fontvariant,
    rest: ascii.slice(stop + 1)
  };
}


const underEls = ["<mi>lim</mi>", "<mo>∑</mo>", "<mo>∏</mo>"];
function shouldGoUnder(el) {
  return underEls.indexOf(el) >= 0;
}

const syntax = {
  endsInFunc: endsInFunc,
  isgroupStart: isgroupStart,
  isgroupable: isgroupable,
  isvertGroupStart: isvertGroupStart,
  splitNextGroup: splitNextGroup,
  splitNextVert: splitNextVert,
  splitNextOperator: splitNextOperator,
  ismatrixInterior: ismatrixInterior,
  isfontCommand: isfontCommand,
  splitfont: splitfont,
  shouldGoUnder: shouldGoUnder
};

export default syntax;
