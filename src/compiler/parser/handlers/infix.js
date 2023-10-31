import handlers from "./index.js";
import expr from "./expr.js";

/**
 * @typedef {import("../parse.js").State} State
 * @typedef {import("../index.js").Node} Node
 * @typedef {import("../index.js").Term} Term
 * @typedef {import("../index.js").BinaryOperation} BinaryOperation
 * @typedef {import("../index.js").TernaryOperation} TernaryOperation
 */

/**
 * @return {Term}
 */
function empty() {
  return { type: "Term", items: [] };
}

const SHOULD_STOP = ["ident", "number", "operator", "text"];

/**
 * Remove surrounding brackets.
 *
 * @template {BinaryOperation | TernaryOperation} Operation
 * @param {Operation} node
 * @returns {Operation}
 */
function maybeRemoveFence(node) {
  const mutated = node;

  mutated.items.forEach((item, i) => {
    if (item.type !== "FencedGroup" || item.items.length !== 1) {
      // No fences to remove.
      return;
    }

    if (i === 0 && node.name !== "frac") {
      // Keep fences around base in sub- and superscripts.
      return;
    }

    const [cell] = item.items;

    if (cell.length !== 1) {
      mutated.items[i] = { type: "Term", items: cell };
      return;
    }

    const [first] = cell;
    const term =
      first.type === "Term" && first.items.length === 1
        ? first.items[0]
        : first;

    if (term.type.endsWith("Literal")) {
      // We fenced a single item for a reason, lets keep them.
      return;
    }

    mutated.items[i] = term;
  });

  return mutated;
}

/**
 * Change `lim` to `under`, and `sum` and `prod` to `under` or `over`.
 *
 * @template {BinaryOperation | TernaryOperation} Operation
 * @param {Operation} node
 * @returns {Operation}
 */
function maybeApplyUnderOver(node) {
  const mutated = node;
  const [operator] = node.items;

  if (operator.type !== "OperatorLiteral") {
    return mutated;
  }

  if (
    node.name === "sub" &&
    ["lim", "∑", "∏", "⋂", "⋃", "⋀", "⋁"].includes(operator.value)
  ) {
    mutated.name = "under";

    return mutated;
  }

  if (
    node.name === "subsup" &&
    ["∑", "∏", "⋂", "⋃", "⋀", "⋁"].includes(operator.value)
  ) {
    mutated.name = "underover";

    return mutated;
  }

  return mutated;
}

/**
 * @template {BinaryOperation | TernaryOperation} Operation
 * @param {Operation} node
 * @returns {Operation}
 */
function post(node) {
  return maybeRemoveFence(maybeApplyUnderOver(node));
}

/**
 * @param {string} op
 * @param {BinaryOperation} left
 * @param {Node} right
 * @returns {BinaryOperation | TernaryOperation}
 */
function maybeTernary(op, left, right) {
  if (left.name === "sub" && op === "sup") {
    const [base, sub] = left.items;

    return {
      type: "TernaryOperation",
      name: "subsup",
      items: [base, sub, right],
    };
  }

  if (left.name === "sup" && op === "sub") {
    const [base, sup] = left.items;

    return {
      type: "TernaryOperation",
      name: "subsup",
      items: [base, right, sup],
    };
  }

  if (left.name === "under" && (op === "over" || op === "sup")) {
    const [base, under] = left.items;

    return {
      type: "TernaryOperation",
      name: "underover",
      items: [base, under, right],
    };
  }

  if (left.name === "over" && (op === "under" || op === "sub")) {
    const [base, over] = left.items;

    return {
      type: "TernaryOperation",
      name: "underover",
      items: [base, right, over],
    };
  }

  const node = post({
    type: "BinaryOperation",
    name: op,
    items: [left, right],
  });

  return rightAssociate(node.name, node.items);
}

/**
 * @param {string} op
 * @param {[Node, Node]} operants
 * @returns {BinaryOperation}
 */
function rightAssociate(op, [left, right]) {
  if (left.type !== "BinaryOperation" || op === "frac") {
    return {
      type: "BinaryOperation",
      name: op,
      items: [left, right],
    };
  }

  const [a, b] = left.items;

  return {
    type: "BinaryOperation",
    name: left.name,
    items: [a, rightAssociate(op, [b, right])],
  };
}

/**
 * @param {State} state
 * @returns {{ node: BinaryOperation | TernaryOperation, end: number }}
 */
export default function infix({ stack, start, tokens }) {
  const token = tokens[start];

  let left = stack.pop();

  if (left && left.type === "SpaceLiteral") {
    left = stack.pop();
  }

  if (!left) {
    left = empty();
  }

  const nextToken = tokens[start + 1];

  let next;
  if (nextToken && SHOULD_STOP.includes(nextToken.type)) {
    const handleRight = handlers.get(nextToken.type);

    if (!handleRight) {
      throw new Error("Unknown handler");
    }

    next = handleRight({ stack: [], start: start + 1, tokens });
  } else {
    next = expr({ stack: [], start: start + 1, tokens });
  }

  if (next && next.node && next.node.type === "SpaceLiteral") {
    next = expr({ stack: [], start: next.end, tokens });
  }

  const { end, node: right } = next;

  if (left.type === "BinaryOperation") {
    return {
      end,
      node: post(maybeTernary(token.value, left, right)),
    };
  }

  return {
    end,
    node: post({
      type: "BinaryOperation",
      name: token.value,
      items: [left, right],
    }),
  };
}
