import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const {
  npm_package_name: NAME,
  npm_package_version: VERSION,
  npm_package_homepage: HOMEPAGE,
  npm_package_license: LICENSE,
} = process.env;
const YEAR = new Date().getFullYear();

const dependenciesConfig = {
  input: "dependencies.src.mjs",
  output: [
    {
      file: `dependencies.mjs`,
      format: "esm",
    },
  ],
  plugins: [resolve(), commonjs()],
};

const defaultConfig = {
  input: "src/index.js",
  output: [
    {
      file: `target/node/${NAME}.cjs`,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: `target/browser/${NAME}.js`,
      format: "iife",
      name: NAME,
      banner: `/*! ${NAME} v${VERSION} | (c) 2015-${YEAR} (${LICENSE}) | ${HOMEPAGE} */`,
      sourcemap: true,
    },
    {
      file: `target/browser/${NAME}.min.js`,
      format: "iife",
      name: NAME,
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            targets: "last 2 versions, not dead",
          },
        ],
      ],
    }),
  ],
};

export default function rollup(args) {
  if (args.configDeps === true) {
    return dependenciesConfig;
  }

  return [dependenciesConfig, defaultConfig];
}
