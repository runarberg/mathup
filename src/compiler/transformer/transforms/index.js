import fencedGroup from "./fenced-group.js";
import literal from "./literal.js";
import matrixGroup from "./matrix-group.js";
import operation from "./operation.js";
import sentence from "./sentence.js";
import spaceLiteral from "./space-literal.js";
import term from "./term.js";
import unaryOperation from "./unary-operation.js";

/** @typedef {import("../index.js").TransformFn} TransformFn */
export default new Map([
  ["BinaryOperation", /** @type {TransformFn} */ (operation)],
  ["FencedGroup", /** @type {TransformFn} */ (fencedGroup)],
  ["IdentLiteral", /** @type {TransformFn} */ (literal("mi"))],
  ["MatrixGroup", /** @type {TransformFn} */ (matrixGroup)],
  ["NumberLiteral", /** @type {TransformFn} */ (literal("mn"))],
  ["OperatorLiteral", /** @type {TransformFn} */ (literal("mo"))],
  ["Sentence", /** @type {TransformFn} */ (sentence)],
  ["SpaceLiteral", /** @type {TransformFn} */ (spaceLiteral)],
  ["Term", /** @type {TransformFn} */ (term)],
  ["TernaryOperation", /** @type {TransformFn} */ (operation)],
  ["TextLiteral", /** @type {TransformFn} */ (literal("mtext"))],
  ["UnaryOperation", /** @type {TransformFn} */ (unaryOperation)],
]);
