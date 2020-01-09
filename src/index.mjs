import compiler from "./compiler/index.mjs";

export default function mathup(
  input,
  {
    bare = false,
    dir = null,
    display = null,

    decimalMark = ".",
    colSep = decimalMark === "," ? ";" : ",",
    rowSep = colSep === ";" ? ";;" : ";",
  } = {},
) {
  const options = {
    bare,
    dir,
    display,

    decimalMark,
    colSep,
    rowSep,
  };

  const compile = compiler(options);

  return compile(input);
}
