import expr from "./expr.mjs";

function empty() {
  return { type: "Term", items: [] };
}

export default function infix({ stack, start, tokens }) {
  const token = tokens[start];

  let left = stack.pop();

  if (left && left.type === "SpaceLiteral") {
    left = stack.pop();
  }

  if (!left) {
    left = empty();
  }

  let next = expr({ stack: [], start: start + 1, tokens });

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
    } else if (token.value === "over" && rightBinary.name === "under") {
      const [over, under] = rightBinary.items;

      node = {
        type: "TernaryOperation",
        name: "underover",
        items: [left, under, over],
      };
    } else if (token.value === "under" && rightBinary.name === "over") {
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
    } else if (token.value === "over" && leftBinary.name === "under") {
      const [base, under] = leftBinary.items;

      node = {
        type: "TernaryOperation",
        name: "underover",
        items: [base, under, right],
      };
    } else if (token.value === "under" && leftBinary.name === "over") {
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

  return { node, end };
}
