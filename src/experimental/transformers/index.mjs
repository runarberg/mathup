import fencedGroup from "./fenced-group.mjs";
import literal from "./literal.mjs";
import matrixGroup from "./matrix-group.mjs";
import operation from "./operation.mjs";
import sentence from "./sentence.mjs";
import spaceLiteral from "./space-literal.mjs";
import term from "./term.mjs";
import unaryOperation from "./unaryOperation.mjs";

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
