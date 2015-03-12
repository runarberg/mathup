"use strict";

let lexicon = require('./lexicon'),
    groupings = lexicon.groupings,
    fonts = lexicon.fonts;

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


function ismatrixInterior(str) {
  return isgroupStart(str) &&
    splitNextGroup(str)[4].trim().startsWith(",");
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

  return [start === 0 ? "" : str.slice(0, start), open,
          str.slice(start+open.length, stop-(close.length-1)),
          close, str.slice(stop+1)];
};


// Text
// ====

function splittext(ascii) {
  let start = ascii.indexOf('"'),
      stop = start + 1 + ascii.slice(start+1).indexOf('"');
  let font = start > 0 ? fonts.get(ascii.slice(0, start)) : "";
  return {
    text: ascii.slice(start+1, stop),
    font: font,
    rest: ascii.slice(stop+1)
  };
}

module.exports = {
  isgroupStart: isgroupStart,
  getopenType: getopenType,
  getcloseType: getcloseType,
  splitNextGroup: splitNextGroup,
  ismatrixInterior: ismatrixInterior,
  splittext: splittext
};
