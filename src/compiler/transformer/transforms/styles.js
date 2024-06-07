/** @typedef {import("../index.js").Tag} Tag */

/**
 * @param {string} name
 * @param {string} value
 * @returns {string}
 */
function withCustomProperty(name, value) {
  return `var(--mathup-${name}-${value}, ${value})`;
}

/**
 * @param {Map<string, string> | undefined} styles
 * @param {Tag | null} tag
 * @returns {Tag | null}
 */
export function applyStyles(styles, tag) {
  if (!styles || !tag) {
    return tag;
  }

  /** @type {Map<string, string>} */
  const combinedStyles = new Map();

  for (const [name, value] of styles) {
    if (name === "background") {
      const currentValue = combinedStyles.get("background");
      const backgroundValue = withCustomProperty(name, value);

      if (currentValue) {
        combinedStyles.set("background", `${currentValue},${backgroundValue}`);
      } else {
        combinedStyles.set("background", backgroundValue);
      }
    } else {
      combinedStyles.set(name, withCustomProperty(name, value));
    }
  }

  let style = tag.attrs?.style ?? "";
  for (const [name, value] of combinedStyles) {
    style += `${name}:${value};`;
  }

  if (!style) {
    return tag;
  }

  return {
    ...tag,
    attrs: tag.attrs ? { ...tag.attrs, style } : { style },
  };
}
