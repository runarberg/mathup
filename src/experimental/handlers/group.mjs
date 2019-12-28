import expr from "./expr.mjs";

export default function group({ start, tokens }) {
  let i = start;
  let token = tokens[i];

  const open = token && token.type === "paren.open" ? token : null;

  const rows = [];
  const seps = [];
  let cols = [];
  let cell = [];

  i += 1;
  token = tokens[i];

  if (token && token.type === "space") {
    // Ignore leading space.
    i += 1;
    token = tokens[i];
  }

  while (token && token.type !== "paren.close") {
    if (token.type === "sep.col") {
      seps.push(token.value);
      cols.push(cell);
      cell = [];
      i += 1;
      token = tokens[i];

      // Ignore leading space.
      if (token && token.type === "space") {
        i += 1;
        token = tokens[i];
      }

      // eslint-disable-next-line no-continue
      continue;
    }

    if (token.type === "sep.row") {
      cols.push(cell);
      rows.push(cols);
      cell = [];
      cols = [];
      i += 1;
      token = tokens[i];

      // Ignore leading space.
      if (token && token.type === "space") {
        i += 1;
        token = tokens[i];
      }

      // eslint-disable-next-line no-continue
      continue;
    }

    const next = expr({
      tokens,
      start: i,
      stack: cell,
    });

    if (next) {
      cell.push(next.node);
      i = next.end || i + 1;
    } else {
      i += 1;
    }

    token = tokens[i];
  }

  if (cell.length > 0) {
    cols.push(cell);
  }

  const close = token && token.type === "paren.close" ? token : null;

  const attrs = {
    open: (open && open.value) || "",
    close: (close && token.value) || "",
    seps,
  };

  let type = "FencedGroup";
  let items = cols;

  if (rows.length > 0) {
    type = "MatrixGroup";
    items = rows;

    if (cols.length > 0) {
      items.push(cols);
    }
  }

  return {
    node: { type, items, attrs },
    end: i + 1,
  };
}
