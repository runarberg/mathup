import test from "ava";
import a2ml from "../src/index.js";

test("Displays subscripts", t => {
  t.is(a2ml("a_i"), "<math><msub><mi>a</mi><mi>i</mi></msub></math>");
});

test("Displays superscripts", t => {
  t.is(a2ml("a^2"), "<math><msup><mi>a</mi><mn>2</mn></msup></math>");
});

test("Displays sub-superscripts", t => {
  t.is(
    a2ml("a_i^2"),
    "<math><msubsup><mi>a</mi><mi>i</mi><mn>2</mn></msubsup></math>",
  );
});

test("Renders sub-superscripts in either direction", t => {
  t.is(
    a2ml("a^2_i"),
    "<math><msubsup><mi>a</mi><mi>i</mi><mn>2</mn></msubsup></math>",
  );
});

test("Allows trailing sub or superscripts", t => {
  t.is(a2ml("a^"), "<math><msup><mi>a</mi><mrow></mrow></msup></math>");
  t.is(a2ml("b_  "), "<math><msub><mi>b</mi><mrow></mrow></msub></math>");
});

test("Allows trailing sub-supscript", t => {
  t.is(
    a2ml("a_i^"),
    "<math><msubsup><mi>a</mi><mi>i</mi><mrow></mrow></msubsup></math>",
  );

  t.is(
    a2ml("a^2_"),
    "<math><msubsup><mi>a</mi><mrow></mrow><mn>2</mn></msubsup></math>",
  );
});

test("Should not treat `^^` as superscript", t => {
  t.is(a2ml("a^^2"), "<math><mi>a</mi><mo>∧</mo><mn>2</mn></math>");
});

test("Should not treat `__` or `_|` as subscript", t => {
  t.is(a2ml("a_|_i"), "<math><mi>a</mi><mo>⊥</mo><mi>i</mi></math>");
  t.is(
    a2ml("|__a__|i"),
    "<math><mo>⌊</mo><mi>a</mi><mo>⌋</mo><mi>i</mi></math>",
  );
});

test("Pythagorean theorem", t => {
  t.is(
    a2ml("a^2 + b^2 = c^2"),
    "<math><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup><mo>=</mo><msup><mi>c</mi><mn>2</mn></msup></math>",
  );
});

test("Matrix transpose", t => {
  t.is(
    a2ml("(X^T)_(ij) = X_(ji)"),
    '<math><msub><mfenced open="(" close=")"><msup><mi>X</mi><mi>T</mi></msup></mfenced><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><msub><mi>X</mi><mrow><mi>j</mi><mi>i</mi></mrow></msub></math>',
  );
});

test("The natural logarithm", t => {
  t.is(
    a2ml("ln x = int_1^x 1/t dt"),
    "<math><mrow><mi>ln</mi><mi>x</mi></mrow><mo>=</mo><msubsup><mo>∫</mo><mn>1</mn><mi>x</mi></msubsup><mfrac><mn>1</mn><mi>t</mi></mfrac><mi>d</mi><mi>t</mi></math>",
  );
});

test("Powers of powers of two", t => {
  t.is(
    a2ml("2^2^2^2"),
    "<math><msup><mn>2</mn><msup><mn>2</mn><msup><mn>2</mn><mn>2</mn></msup></msup></msup></math>",
  );
});
