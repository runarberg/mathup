import {
  KNOWN_COMMANDS,
  KNOWN_IDENTS,
  KNOWN_OPS,
  KNOWN_PREFIX,
  isAlphabetic,
  isAlphanumeric,
  isMark,
} from "../lexemes.js";

import { allowedStandalonePrefix, hasOperand } from "./utils.js";

/** @type {import("./index.js").Scanner} */
export default function alphaScanner(char, input, { start, grouping }) {
  if (!isAlphabetic(char)) {
    return null;
  }

  let nextChar = char;
  let value = "";

  while (
    isAlphabetic(nextChar) ||
    isMark(nextChar) ||
    (value.length > 0 && nextChar === ".")
  ) {
    const i = start + value.length + nextChar.length;

    value += nextChar;
    [nextChar] = input.slice(i);
  }

  // alpha may contain a period, but not never end with one.
  if (value.endsWith(".")) {
    value = value.slice(0, -1);
  }

  let end = start + value.length;

  {
    const operator = KNOWN_OPS.get(value);

    if (operator) {
      return {
        type: "operator",
        value: operator.value,
        attrs: operator.attrs,
        end: start + value.length,
      };
    }
  }

  {
    const ident = KNOWN_IDENTS.get(value);

    if (ident) {
      return {
        type: "ident",
        value: ident.value,
        attrs: ident.attrs,
        end: start + value.length,
      };
    }
  }

  const potential = `${value}${nextChar}`;
  const [nextNextChar] = input.slice(start + potential.length);

  {
    const operator = KNOWN_OPS.get(potential);

    if (operator && !isAlphanumeric(nextNextChar)) {
      return {
        type: "operator",
        value: operator.value,
        attrs: operator.attrs,
        end: start + potential.length,
      };
    }
  }

  {
    const ident = KNOWN_IDENTS.get(potential);

    if (ident && !isAlphanumeric(nextNextChar)) {
      return {
        type: "ident",
        value: ident.value,
        attrs: ident.attrs,
        end: start + potential.length,
      };
    }
  }

  {
    const prefix = KNOWN_PREFIX.get(value);
    if (
      prefix &&
      (allowedStandalonePrefix(prefix) || hasOperand(input, end, grouping))
    ) {
      return {
        type: "prefix",
        value: "",
        end,
        ...prefix,
      };
    }
  }

  {
    const command = KNOWN_COMMANDS.get(value);
    if (command && hasOperand(input, end, grouping)) {
      return {
        type: "command",
        end,
        ...command,
      };
    }
  }

  if (value.includes(".")) {
    // Period not used, lets toss it.
    value = value.slice(0, value.indexOf("."));
    end = start + value.length;
  }

  return {
    type: "ident",
    value,
    end,
    split: true,
  };
}
