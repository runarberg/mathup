import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const {
  npm_package_name: NAME,
  npm_package_version: VERSION,
  npm_package_homepage: HOMEPAGE,
  npm_package_license: LICENSE
} = process.env;
const YEAR = new Date().getFullYear();

export default {
  input: "src/index.js",
  output: [
    {
      file: `target/node/${NAME}.js`,
      format: "cjs",
      sourcemap: true
    },
    {
      file: `target/browser/${NAME}.js`,
      format: "iife",
      name: NAME,
      banner: `/*! ${NAME} v${VERSION} | (c) 2015-${YEAR} (${LICENSE}) | ${HOMEPAGE} */`,
      sourcemap: true
    },
    {
      file: `target/browser/${NAME}.min.js`,
      format: "iife",
      name: NAME,
      plugins: [terser()]
    }
  ],
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            targets: "last 2 versions, not dead"
          }
        ]
      ]
    })
  ]
};
