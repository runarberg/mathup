import test from "ava";
import a2ml from "../src/index.js";

test("Displays fractions", t => {
  t.is(a2ml("a/b"), "<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>");
});

test("Displays bevelled fractions", t => {
  t.is(
    a2ml("a./b"),
    '<math><mfrac bevelled="true"><mi>a</mi><mi>b</mi></mfrac></math>',
  );
});

test("Does not parse `//` as fraction", t => {
  t.is(a2ml("a//b"), "<math><mi>a</mi><mo>/</mo><mi>b</mi></math>");
});

test("Omits brackets around numerator or denominator", t => {
  t.is(
    a2ml("(a+b)/(c+d)"),
    "<math><mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mrow><mi>c</mi><mo>+</mo><mi>d</mi></mrow></mfrac></math>",
  );
});

test("Allows trailing fractions", t => {
  t.is(a2ml("a/"), "<math><mfrac><mi>a</mi><mrow></mrow></mfrac></math>");
  t.is(
    a2ml("b ./ "),
    '<math><mfrac bevelled="true"><mi>b</mi><mrow></mrow></mfrac></math>',
  );
});

test("Significant whitespace in fractions", t => {
  t.is(
    a2ml("1+3 / 2+2"),
    "<math><mfrac><mrow><mn>1</mn><mo>+</mo><mn>3</mn></mrow><mrow><mn>2</mn><mo>+</mo><mn>2</mn></mrow></mfrac></math>",
  );
  t.is(
    a2ml("1 + 3/2 + 2"),
    "<math><mn>1</mn><mo>+</mo><mfrac><mn>3</mn><mn>2</mn></mfrac><mo>+</mo><mn>2</mn></math>",
  );
  t.is(
    a2ml("a./b / c./d"),
    '<math><mfrac><mfrac bevelled="true"><mi>a</mi><mi>b</mi></mfrac><mfrac bevelled="true"><mi>c</mi><mi>d</mi></mfrac></mfrac></math>',
  );
});

test("Golden ratio (continued fraction)", t => {
  t.is(
    a2ml("phi = 1 + 1/(1 + 1/(1 + 1/(1 + 1/(1 + ddots))))"),
    "<math><mi>φ</mi><mo>=</mo><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mo>⋱</mo></mrow></mfrac></mrow></mfrac></mrow></mfrac></mrow></mfrac></math>",
  );
});

test("Normal distribution", t => {
  t.is(
    a2ml(
      "cc`N`(x | mu, sigma^2) = 1/(sqrt(2pi sigma^2)) e^(-((x-mu)^2) / 2sigma^2)",
    ),
    '<math><mi mathvariant="script">N</mi><mfenced open="(" close=")"><mrow><mi>x</mi><mo stretchy="true" lspace="veryverythickmathspace" rspace="veryverythickmathspace">|</mo><mi>μ</mi></mrow><msup><mi>σ</mi><mn>2</mn></msup></mfenced><mo>=</mo><mfrac><mn>1</mn><msqrt><mrow><mn>2</mn><mi>π</mi><msup><mi>σ</mi><mn>2</mn></msup></mrow></msqrt></mfrac><msup><mi>e</mi><mrow><mo>-</mo><mfrac><msup><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>μ</mi></mrow></mfenced><mn>2</mn></msup><mrow><mn>2</mn><msup><mi>σ</mi><mn>2</mn></msup></mrow></mfrac></mrow></msup></math>',
  );
});
