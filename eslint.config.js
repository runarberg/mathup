import js from "@eslint/js";
import ava from "eslint-plugin-ava";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  // importPlugin:recommended
  {
    languageOptions: {
      parserOptions: {
        // Eslint doesn't supply ecmaVersion in `parser.js` `context.parserOptions`
        // This is required to avoid ecmaVersion < 2015 error or 'import' / 'export' error
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: { import: importPlugin },
    settings: {
      "import/parsers": {
        espree: [".js", ".cjs", ".mjs"],
      },
      "import/resolver": {
        node: true,
      },
    },
    rules: {
      ...importPlugin.configs["recommended"].rules,
    },
  },

  {
    plugins: {
      prettier,
    },

    rules: prettier.configs.recommended.rules,
  },

  {
    ignores: [
      ".git/",
      "package-lock.json",
      "node_modules/",
      "coverage/",
      "dist/",
    ],
  },

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "accessor-pairs": "error",
      "array-callback-return": "error",
      "class-methods-use-this": "error",
      curly: ["error", "all"],
      eqeqeq: [
        "error",
        "always",
        {
          null: "ignore",
        },
      ],
      "grouped-accessor-pairs": "error",
      "no-alert": "error",
      "no-caller": "error",
      "no-console": "warn",
      "no-debugger": "warn",
      "no-else-return": [
        "error",
        {
          allowElseIf: false,
        },
      ],
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-implicit-coercion": "error",
      "no-implied-eval": "error",
      "no-invalid-this": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-multi-str": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-octal-escape": "error",
      "no-param-reassign": "error",
      "no-return-assign": "error",
      "no-return-await": "error",
      "no-script-url": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-shadow": "error",
      "no-template-curly-in-string": "error",
      "no-throw-literal": "error",
      "no-unmodified-loop-condition": "error",
      "no-unused-expressions": "error",
      "no-useless-backreference": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "no-void": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-promise-reject-errors": "error",
      "prefer-template": "error",
      radix: ["error", "as-needed"],
      "require-atomic-updates": "error",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],

      "import/extensions": ["error", "ignorePackages"],
      "import/first": "error",
      "import/no-commonjs": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": "error",
      // Typescript catces this better
      "import/no-named-as-default": "off",
      // Typescript handles this better
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],

      // Handled better by typescript
      "jsdoc/no-undefined-types": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-property-description": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/tag-lines": "off",
    },
  },

  {
    files: [
      "src/custom-element.js",
      "src/compiler/renders/to-dom.js",
      "src/compiler/renders/update-dom.js",
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  {
    files: ["**/*.test.js", "/test/**/*.js"],

    plugins: {
      ava,
    },

    rules: {
      ...ava.configs.recommended.rules,
    },
  },

  {
    files: ["*.config.js", "bin/**/*.js"],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["docs/**/*.js", "demo/**/*.js"],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
