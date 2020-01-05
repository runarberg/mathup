import handlers from "./index.mjs";
import expr from "./expr.mjs";

function empty() {
  return { type: "Term", items: [] };
}

const SHOULD_STOP = ["ident", "number", "operator", "text"];

export default function infix({ stack, start, tokens }) {
  const token = tokens[start];

  let left = stack.pop();

  if (left && left.type === "SpaceLiteral") {
    left = stack.pop();
  }

  if (!left) {
    left = empty();
  }

  while (left.type === "Term" && left.items.length === 1) {
    [left] = left.items;
  }

  const nextToken = tokens[start + 1];

  let next;
  if (nextToken && SHOULD_STOP.includes(nextToken.type)) {
    const handleRight = handlers.get(nextToken.type);

    next = handleRight({ start: start + 1, tokens });
  } else {
    next = expr({ stack: [], start: start + 1, tokens });
  }

  if (next && next.node && next.node.type === "SpaceLiteral") {
    next = expr({ stack: [], start: next.end, tokens });
  }

  const right = (next && next.node) || empty();
  const end = (next && next.end) || start + 2;

  let node;
  if (
    right.type === "BinaryOperation" ||
    (right.type === "Term" &&
      right.items.length === 1 &&
      right.items[0].type === "BinaryOperation")
  ) {
    const rightBinary =
      right.type === "BinaryOperation" ? right : right.items[0];

    if (token.value === "sup" && rightBinary.name === "sub") {
      const [sup, sub] = rightBinary.items;

      node = {
        type: "TernaryOperation",
        name: "subsup",
        items: [left, sub, sup],
      };
    } else if (token.value === "sub" && rightBinary.name === "sup") {
      const [sub, sup] = rightBinary.items;

      node = {
        type: "TernaryOperation",
        name: "subsup",
        items: [left, sub, sup],
      };
    } else if (
      token.value === "over" &&
      (rightBinary.name === "under" || rightBinary.name === "sub")
    ) {
      const [over, under] = rightBinary.items;

      node = {
        type: "TernaryOperation",
        name: "underover",
        items: [left, under, over],
      };
    } else if (
      token.value === "under" &&
      (rightBinary.name === "over" || rightBinary.name === "sup")
    ) {
      const [under, over] = rightBinary.items;

      node = {
        type: "TernaryOperation",
        name: "underover",
        items: [left, under, over],
      };
    }
  } else if (
    left.type === "BinaryOperation" ||
    (left.type === "Term" &&
      left.items.length === 1 &&
      left.items[0].type === "BinaryOperation")
  ) {
    const leftBinary = left.type === "BinaryOperation" ? left : left.items[0];

    if (token.value === "sup" && leftBinary.name === "sub") {
      const [base, sub] = leftBinary.items;

      node = {
        type: "TernaryOperation",
        name: "subsup",
        items: [base, sub, right],
      };
    } else if (token.value === "sub" && leftBinary.name === "sup") {
      const [base, sup] = leftBinary.items;

      node = {
        type: "TernaryOperation",
        name: "subsup",
        items: [base, right, sup],
      };
    } else if (
      (token.value === "over" || token.value === "sup") &&
      leftBinary.name === "under"
    ) {
      const [base, under] = leftBinary.items;

      node = {
        type: "TernaryOperation",
        name: "underover",
        items: [base, under, right],
      };
    } else if (
      (token.value === "under" || token.value === "sub") &&
      leftBinary.name === "over"
    ) {
      const [base, over] = leftBinary.items;

      node = {
        type: "TernaryOperation",
        name: "underover",
        items: [base, right, over],
      };
    }
  }

  if (!node) {
    node = {
      type: "BinaryOperation",
      name: token.value,
      items: [left, right],
    };
  }

  // Remove surrounding brackets.
  node.items.forEach((item, i) => {
    if (i === 0 && node.name !== "frac") {
      return;
    }

    if (item.type === "FencedGroup" && item.items.length === 1) {
      const [cell] = item.items;

      if (cell.length === 1) {
        let [term] = cell;

        if (term.type === "Term" && term.items.length === 1) {
          [term] = term.items;
        }

        if (!term.type.endsWith("Literal")) {
          node.items[i] = term;
        }
      } else {
        node.items[i] = {
          type: "Term",
          items: cell,
        };
      }
    }
  });

  // Change `lim` to `under`, and `sum` and `prod` to `under` or `over`.
  if (node.type === "BinaryOperation") {
    const [operator] = node.items;

    if (
      node.name === "sub" &&
      operator.type === "OperatorLiteral" &&
      ["lim", "∑", "∏", "⋂", "⋃", "⋀", "⋁"].includes(operator.value)
    ) {
      node.name = "under";
    }
  } else if (node.type === "TernaryOperation") {
    const [operator] = node.items;

    if (
      node.name === "subsup" &&
      operator.type === "OperatorLiteral" &&
      ["∑", "∏", "⋂", "⋃", "⋀", "⋁"].includes(operator.value)
    ) {
      node.name = "underover";
    }
  }

  return { node, end };
}
