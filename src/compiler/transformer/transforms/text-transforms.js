// See tables at https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols

/**
 * @param {(char: string) => string} fn
 * @param {string} string
 * @returns {string}
 */
function mapChars(fn, string) {
  let mapped = "";

  for (const char of string) {
    mapped += fn(char);
  }

  return mapped;
}

/**
 * @param {[[number, number], number][]} ranges
 * @param {Map<string, string>} [defaults]
 * @returns {(char: string) => string}
 */
function createCharMapping(ranges, defaults) {
  return (char) => {
    if (defaults) {
      const found = defaults.get(char);

      if (found) {
        return found;
      }
    }

    const codePoint = char.codePointAt(0);

    if (!codePoint) {
      return char;
    }

    for (const [[min, max], offset] of ranges) {
      if (min <= codePoint && codePoint <= max) {
        return String.fromCodePoint(codePoint + offset);
      }
    }

    return char;
  };
}

/**
 * @param {[number, number]} range
 * @returns {(offset: number) => [[number, number], number]}
 */
function createRange([min, max]) {
  return (offset) => [[min, max], offset - min];
}

const digitRange = createRange([0x30, 0x39]);
const latinCapitalLetterRange = createRange([0x41, 0x5a]);
const latinSmallLetterRange = createRange([0x61, 0x7a]);
const greekCapitalLetterRange = createRange([0x0391, 0x03a9]);
const greekSmallLetterRange = createRange([0x03b1, 0x03c9]);

const bold = createCharMapping(
  [
    digitRange(0x1d7ce),
    latinCapitalLetterRange(0x1d400),
    latinSmallLetterRange(0x1d41a),
    greekCapitalLetterRange(0x1d6a8),
    greekSmallLetterRange(0x1d6c2),
  ],
  new Map([
    ["ϴ", "𝚹"],
    ["∇", "𝛁"],
    ["∂", "𝛛"],
    ["ϵ", "𝛜"],
    ["ϑ", "𝛝"],
    ["ϰ", "𝛞"],
    ["ϕ", "𝛟"],
    ["ϱ", "𝛠"],
    ["ϖ", "𝛡"],
    ["Ϝ", "𝟊"],
    ["ϝ", "𝟋"],
  ]),
);

const italic = createCharMapping(
  [
    latinCapitalLetterRange(0x1d434),
    latinSmallLetterRange(0x1d44e),
    greekCapitalLetterRange(0x1d6e2),
    greekSmallLetterRange(0x1d6fc),
  ],
  new Map([
    ["h", "ℎ"],
    ["ı", "𝚤"],
    ["ȷ", "𝚥"],
    ["ϴ", "𝛳"],
    ["∇", "𝛻"],
    ["∂", "𝜕"],
    ["ϵ", "𝜖 "],
    ["ϑ", "𝜗"],
    ["ϰ", "𝜘"],
    ["ϕ", "𝜙"],
    ["ϱ", "𝜚"],
    ["ϖ", "𝜛"],
  ]),
);

const boldItalic = createCharMapping(
  [
    latinCapitalLetterRange(0x1d468),
    latinSmallLetterRange(0x1d482),
    greekCapitalLetterRange(0x1d71c),
    greekSmallLetterRange(0x1d736),
  ],
  new Map([
    ["ϴ", "𝜭"],
    ["∇", "𝜵"],
    ["∂", "𝝏"],
    ["ϵ", "𝝐"],
    ["ϑ", "𝝑"],
    ["ϰ", "𝝒"],
    ["ϕ", "𝝓"],
    ["ϱ", "𝝔"],
    ["ϖ", "𝝕"],
  ]),
);

const doubleStruck = createCharMapping(
  [
    digitRange(0x1d7d8),
    latinCapitalLetterRange(0x1d538),
    latinSmallLetterRange(0x1d552),
  ],
  new Map([
    ["C", "ℂ"],
    ["H", "ℍ"],
    ["N", "ℕ"],
    ["P", "ℙ"],
    ["Q", "ℚ"],
    ["R", "ℝ"],
    ["Z", "ℤ"],
    ["π", "ℼ"],
    ["γ", "ℽ"],
    ["Π", "ℿ"],
    ["∑", "⅀"],
  ]),
);

const italicDoubleStruck = createCharMapping(
  [],
  new Map([
    ["D", "ⅅ"],
    ["d", "ⅆ"],
    ["i", "ⅈ"],
    ["j", "ⅉ"],
  ]),
);

const fraktur = createCharMapping(
  [latinCapitalLetterRange(0x1d504), latinSmallLetterRange(0x1d51e)],
  new Map([
    ["C", "ℭ"],
    ["H", "ℌ"],
    ["I", "ℑ"],
    ["R", "ℜ"],
    ["Z", "ℨ"],
  ]),
);

const boldFraktur = createCharMapping([
  latinCapitalLetterRange(0x1d56c),
  latinSmallLetterRange(0x1d586),
]);

const monospace = createCharMapping([
  digitRange(0x1d7f6),
  latinCapitalLetterRange(0x1d670),
  latinSmallLetterRange(0x1d68a),
]);

const sansSerif = createCharMapping([
  digitRange(0x1d7e2),
  latinCapitalLetterRange(0x1d5a0),
  latinSmallLetterRange(0x1d5ba),
]);

const boldSansSerif = createCharMapping(
  [
    digitRange(0x1d7ec),
    latinCapitalLetterRange(0x1d5d4),
    latinSmallLetterRange(0x1d5ee),
    greekCapitalLetterRange(0x1d756),
    greekSmallLetterRange(0x1d770),
  ],
  new Map([
    ["ϴ", "𝝧"],
    ["∇", "𝝯"],
    ["∂", "𝞉"],
    ["ϵ", "𝞊"],
    ["ϑ", "𝞋"],
    ["ϰ", "𝞌"],
    ["ϕ", "𝞍"],
    ["ϱ", "𝞎"],
    ["ϖ", "𝞏"],
  ]),
);

const italicSansSerif = createCharMapping([
  latinCapitalLetterRange(0x1d608),
  latinSmallLetterRange(0x1d622),
]);

const boldItalicSansSerif = createCharMapping(
  [
    latinCapitalLetterRange(0x1d63c),
    latinSmallLetterRange(0x1d656),
    greekCapitalLetterRange(0x1d790),
    greekSmallLetterRange(0x1d7aa),
  ],
  new Map([
    ["ϴ", "𝞡"],
    ["∇", "𝞩"],
    ["∂", "𝟃"],
    ["ϵ", "𝟄"],
    ["ϑ", "𝟅"],
    ["ϰ", "𝟆"],
    ["ϕ", "𝟇"],
    ["ϱ", "𝟈"],
    ["ϖ", "𝟉"],
  ]),
);

const script = createCharMapping(
  [latinCapitalLetterRange(0x1d49c), latinSmallLetterRange(0x1d4b6)],
  new Map([
    ["B", "ℬ"],
    ["E", "ℰ"],
    ["F", "ℱ"],
    ["H", "ℋ"],
    ["I", "ℐ"],
    ["L", "ℒ"],
    ["M", "ℳ"],
    ["R", "ℛ"],
    ["e", "ℯ"],
    ["g", "ℊ"],
    ["o", "ℴ"],
  ]),
);

const boldScript = createCharMapping([
  latinCapitalLetterRange(0x1d4d0),
  latinSmallLetterRange(0x1d4ea),
]);

/**
 * @param {string} family
 * @returns {string}
 */
function fontFamilyStyleValue(family) {
  return `var(--mathup-font-family-${family}, ${family})`;
}

/**
 * @typedef {import("../../parser/index.js").LiteralAttrs} LiteralAttrs
 * @param {LiteralAttrs} attrs
 * @param {string[]} transforms
 * @returns {LiteralAttrs}
 */
export function textLiteralAttrs(attrs, transforms) {
  /** @type {Map<string, string>} */
  const styles = new Map();

  if (transforms.includes("bold")) {
    styles.set("font-weight", "bold");
  }

  if (transforms.includes("italic")) {
    styles.set("font-style", "italic");
  }

  // serif is default font-family, so no need to check for `rm`.
  if (transforms.includes("sans-serif")) {
    styles.set("font-family", fontFamilyStyleValue("sans-serif"));
  } else if (transforms.includes("monospace")) {
    styles.set("font-family", fontFamilyStyleValue("monospace"));
  }

  if (styles.size === 0) {
    return attrs;
  }

  let style = "";
  for (const [name, value] of styles) {
    style += `${name}:${value};`;
  }

  return {
    ...attrs,
    style,
  };
}

/**
 * @param {string} text
 * @param {string[]} transforms
 * @returns {string}
 */
export function textLiteralValue(text, transforms) {
  if (transforms.includes("double-struck")) {
    return mapChars(doubleStruck, text);
  }

  if (transforms.includes("script")) {
    return mapChars(script, text);
  }

  if (transforms.includes("fraktur")) {
    return mapChars(fraktur, text);
  }

  return text;
}

/**
 * @param {string} text
 * @param {string[]} transforms
 * @returns {string}
 */
export function literalValue(text, transforms) {
  if (transforms.includes("bold")) {
    if (transforms.includes("italic")) {
      if (transforms.includes("sans-serif")) {
        return mapChars(boldItalicSansSerif, text);
      }

      return mapChars(boldItalic, text);
    }

    if (transforms.includes("script")) {
      return mapChars(boldScript, text);
    }

    if (transforms.includes("fraktur")) {
      return mapChars(boldFraktur, text);
    }

    if (transforms.includes("sans-serif")) {
      return mapChars(boldSansSerif, text);
    }

    return mapChars(bold, text);
  }

  if (transforms.includes("italic")) {
    if (transforms.includes("double-struck")) {
      return mapChars(italicDoubleStruck, text);
    }

    if (transforms.includes("sans-serif")) {
      return mapChars(italicSansSerif, text);
    }

    return mapChars(italic, text);
  }

  if (transforms.includes("sans-serif")) {
    return mapChars(sansSerif, text);
  }

  if (transforms.includes("monospace")) {
    return mapChars(monospace, text);
  }

  return textLiteralValue(text, transforms);
}
