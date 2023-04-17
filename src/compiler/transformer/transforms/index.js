import fencedGroup from "./fenced-group.js";
import literal from "./literal.js";
import matrixGroup from "./matrix-group.js";
import operation from "./operation.js";
import sentence from "./sentence.js";
import spaceLiteral from "./space-literal.js";
import term from "./term.js";
import unaryOperation from "./unaryOperation.js";

export default new Map([
  ["BinaryOperation", operation],
  ["FencedGroup", fencedGroup],
  ["IdentLiteral", literal("mi")],
  ["MatrixGroup", matrixGroup],
  ["NumberLiteral", literal("mn")],
  ["OperatorLiteral", literal("mo")],
  ["Sentence", sentence],
  ["SpaceLiteral", spaceLiteral],
  ["Term", term],
  ["TernaryOperation", operation],
  ["TextLiteral", literal("mtext")],
  ["UnaryOperation", unaryOperation],
]);
