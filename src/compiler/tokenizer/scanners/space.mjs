export default function spaceScanner(char, input, { start }) {
  if (char !== " ") {
    return null;
  }

  let i = start;
  let nextChar = char;
  let value = "";

  while (nextChar === " ") {
    value += nextChar;
    i += 1;
    nextChar = input[i];
  }

  return {
    type: "space",
    value,
    end: i,
  };
}
