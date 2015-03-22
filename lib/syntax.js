"use strict";

let lexicon = require('./lexicon'),
    operators = lexicon.operators,
    groupings = lexicon.groupings,
    fonts = lexicon.fonts;

function splitNextOperator(str) {
  let re = new RegExp('^'+operators.regexp.source),
      match = re.exec(str),
      op = match[0];

  return [operators.get(op), str.slice(op.length)];
}


function isgroupStart(str) {
  let re = new RegExp("^" + groupings.open.regexp.source);
  return str.match(re);
}

function getgroupType(type, str) {
  let match = groupings[type].regexp.exec(str),
      ascii = match[0],
      grouptype = groupings[type].get(ascii);
  return grouptype;
}

function getopenType(str) { return getgroupType("open", str); }
function getcloseType(str) { return getgroupType("close", str); }


function isgroupable(str, options) {
  let re = new RegExp("^[0-9A-Za-z+\\-!]{2,}( |" +
                      options.colSep +"|"+ options.rowSep + ")");
  return str.match(re);
}

function ismatrixInterior(str, colSep) {
  return isgroupStart(str) &&
    splitNextGroup(str)[4].trim().startsWith(colSep);
}

const funcEndingRe = new RegExp(
  "(" +
    lexicon.identifiers.funs
    .concat(Object.keys(lexicon.accents))
    .concat(['sqrt'])
    .sort(function(a, b) {
      return a.length - b.length;
    }).join('|') +
    ")$");
function endsInFunc(str) {
  return str.match(funcEndingRe);
}


function splitNextWhitespace(str, options) {
  let re = new RegExp("(\\s|" + options.colSep +"|"+ options.rowSep + "|$)"),
      rootRE = new RegExp("root(\\d+(" + options.decMark + "\\d+)?$|[A-Za-z]$)");
  let match = str.match(re),
      head = str.slice(0, match.index),
      sep = match[0],
      tail = str.slice(match.index+1),
      next = head,
      rest = sep + tail;
  if (endsInFunc(head) || head.match(rootRE)) {
    let newsplit = splitNextWhitespace(tail, options);
    next += sep + newsplit[0];
    rest = newsplit[1];
  } else if (head.match(/root$/)) {
    let split1 = splitNextWhitespace(tail, options),
        split2 = splitNextWhitespace(split1[1].trimLeft(), options);
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

  let openRE = new RegExp("^"+groupings.open.regexp.source),
      closeRE = new RegExp("^"+groupings.close.regexp.source);

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
      };
      i += closeMatch[0].length;

    } else i += 1;
  }

  if (!open) return null;

  return [start === 0 ? "" : str.slice(0, start),
          groupings.open.get(open),
          str.slice(start+open.length, stop-(close.length-1)),
          groupings.close.get(close),
          str.slice(stop+1)];
};

function isvertGroupStart(str) {
  if (!str.startsWith('|')) return false;
  let split = splitNextVert(str);
  return split && split[0] === "";
}

function splitNextVert(str) {
  function retval(start, stop, double) {
    return [start === 0 ? "" : str.slice(0, start),
            double ? '‖' : '|',
            str.slice(start + (double ? 2 : 1), stop),
            double ? '‖' : '|',
            str.slice(stop + (double ? 2 : 1))];
  }

  let start = str.indexOf('|'),
      stop = start+1,
      rest = str.slice(start+1);
  let double = rest.startsWith('|'),
      re = double ? /\|\|/ : /\|/;

  if (double) {
    rest = rest.slice(1);
    stop += 1;
  }

  if (rest.indexOf('|') === -1) return null;
  if (rest.match(/^\.?[_\^]/)) return null;

  while (rest.length > 0) {
    let split = splitNextGroup(rest),
        head = split ? split[0] : rest,
        tail = split ? split[4] : "";
    let match = re.exec(head);
    
    if (match) return retval(start, stop+match.index, double);

    stop += split.slice(0, -1).map(dot("length")).reduce(plus);
    // adjust for slim brackets
    if (split[1] === "") stop += 2;
    else if (split[1] === "〈") stop += 1;
    if (split[3] === "") stop += 2;
    else if (split[3] === "〉") stop += 1;

    rest = tail;
  }

  return null;
}

function dot(attr) {
  return function(obj) {
    return obj[attr];
  };
}

function plus(a, b) { return a+b; }


// Fonts
// =====

function isfontCommand(str) {
  return isforcedIdentifier(str) || isforcedText(str);
}

function isforcedEl(reEnd) {
  let re = new RegExp("^" + fonts.regexp.source + "?" + reEnd);
  return function(str) {
    return re.exec(str);
  };
}

var isforcedIdentifier = isforcedEl('(`)\\w+`');
var isforcedText = isforcedEl('(")');
function splitfont(ascii) {
  let typematch = isforcedIdentifier(ascii) || isforcedText(ascii),
      type = typematch && typematch[2],
      tagname = type === '"' ? "mtext" :
        type === "`" ? "mi" :
        "";

  let start = ascii.indexOf(type),
      stop = start + 1 + ascii.slice(start+1).indexOf(type),
      font = start > 0 ? fonts.get(ascii.slice(0, start)) : "";

  return {
    tagname: tagname,
    text: ascii.slice(start+1, stop),
    font: font,
    rest: ascii.slice(stop+1)
  };
}


const underEls = ['<mi>lim</mi>', '<mo>∑</mo>', '<mo>∏</mo>'];
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
