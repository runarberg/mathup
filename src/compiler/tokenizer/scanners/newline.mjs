export default function(char, input, { start, grouping }) {
  if (char !== "\n") {
    return null;
  }

  let i = start;
  let nextChar = char;
  let value = "";

  while (nextChar === "\n") {
    value += nextChar;
    i += 1;
    nextChar = input[i];
  }

  return {
    type: grouping ? "sep.row" : "space",
    value,
    end: i,
  };
}
