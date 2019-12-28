import { isAlphanumeric } from "../lexemes.mjs";

function handleFence(char, pos, input, { offset = 0 } = {}) {
  let len = 0;

  while (input[pos + offset + len] === char) {
    len += 1;
  }

  let value = "";
  let closeLen = 0;
  let i = pos + offset + len;

  while (closeLen < len) {
    if (i >= input.length) {
      break;
    }

    if (input[i] === char) {
      closeLen += 1;
    } else {
      if (closeLen > 0) {
        value += char.repeat(closeLen);
        closeLen = 0;
      }

      value += input[i];
    }

    i += 1;
  }

  return {
    value: value.trim(),
    end: i,
  };
}

export function handleBacktick(pos, input, options) {
  return handleFence("`", pos, input, options);
}

export function handleQuote(pos, input, options) {
  return handleFence('"', pos, input, options);
}

export function handlePrefixed(prefix, pos, input) {
  const start = pos + prefix.length;
  let value = "";
  let [char] = input.slice(start);

  if (isAlphanumeric(char)) {
    while (isAlphanumeric(char)) {
      value += char;
      [char] = input.slice(start + value.length);
    }

    return { value, end: start + value.length };
  }

  if (char === "`") {
    return handleBacktick(pos, input, { offset: prefix.length });
  }

  return { value: char, end: start + char.length };
}
