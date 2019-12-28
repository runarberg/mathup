import handlers from "./index.mjs";

const KEEP_GOING_TYPES = [
  "ident",
  "infix",
  "number",
  "operator",
  "paren.open",
  "text",
];

export default function term({ start, tokens }) {
  let i = start;
  let token = tokens[i];
  const items = [];

  while (token && KEEP_GOING_TYPES.includes(token.type)) {
    const handler = handlers.get(token.type);
    const next = handler({ start: i, stack: items, tokens });

    items.push(next.node);

    i = next.end;
    token = tokens[i];
  }

  return {
    node: {
      type: "Term",
      items,
    },
    end: i,
  };
}
