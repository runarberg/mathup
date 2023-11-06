import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

/**
 * @typedef {import("rollup").RollupOptions} RollupOptions
 * @typedef {import("rollup").RollupOptionsFunction} RollupOptionsFunction
 */

const {
  npm_package_name: NAME,
  npm_package_version: VERSION,
  npm_package_homepage: HOMEPAGE,
  npm_package_license: LICENSE,
} = process.env;
const YEAR = new Date().getFullYear();

/** @type {RollupOptions} */
const defaultConfig = {
  input: "src/index.js",
  output: [
    {
      file: `dist/node/${NAME}.cjs`,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: `dist/module/${NAME}.js`,
      format: "module",
      sourcemap: true,
    },
    {
      file: `dist/module/${NAME}.min.js`,
      format: "module",
      plugins: [terser()],
    },
    {
      file: `dist/browser/${NAME}.iife.js`,
      format: "iife",
      name: NAME,
      banner: `/*! ${NAME} v${VERSION} | (c) 2015-${YEAR} (${LICENSE}) | ${HOMEPAGE} */`,
      sourcemap: true,
    },
    {
      file: `dist/browser/${NAME}.iife.min.js`,
      format: "iife",
      name: NAME,
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({
      babelHelpers: "runtime",
    }),
  ],
};

/** @type {RollupOptions} */
const customElementConfig = {
  input: "src/custom-element.js",
  output: [
    {
      file: `dist/module/math-up-element.js`,
      format: "module",
      sourcemap: true,
    },
    {
      file: `dist/module/math-up-element.min.js`,
      format: "module",
      plugins: [terser()],
    },
    {
      file: `dist/browser/math-up-element.iife.js`,
      format: "iife",
      name: "MathUpElement",
      banner: `/*! ${NAME} v${VERSION} | (c) 2015-${YEAR} (${LICENSE}) | ${HOMEPAGE} */`,
      sourcemap: true,
    },
    {
      file: `dist/browser/math-up-element.iife.min.js`,
      format: "iife",
      name: "MathUpElement",
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({
      babelHelpers: "runtime",
    }),
  ],
};

/** @type {RollupOptionsFunction} */
export default function rollup() {
  return [defaultConfig, customElementConfig];
}
