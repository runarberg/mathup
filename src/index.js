import compiler from "./compiler/index.js";

/**
 * @typedef {import("./compiler/index.js").Result} Mathup
 * @typedef {import("./compiler/index.js").Options} Options
 * @param {string} input
 * @param {Options} [options]
 * @returns {Mathup}
 */
export default function mathup(input, options = {}) {
  const compile = compiler(options);

  return compile(input);
}
