export default function groupSep(
  char,
  input,
  { grouping, start },
  { colSep = ",", rowSep = ";" } = {},
) {
  if (!grouping) {
    return null;
  }

  const colSepEnd = start + colSep.length;
  const rowSepEnd = start + rowSep.length;

  if (input.slice(start, rowSepEnd) === rowSep) {
    return {
      type: "sep.row",
      value: rowSep,
      end: rowSepEnd,
    };
  }

  if (input.slice(start, colSepEnd) === colSep) {
    return {
      type: "sep.col",
      value: colSep,
      end: colSepEnd,
    };
  }

  return null;
}
