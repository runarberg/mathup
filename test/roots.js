import test from "ava";
import a2ml from "../src/index.js";

test("Displays square roots", t => {
  t.is(a2ml("sqrt x"), "<math><msqrt><mi>x</mi></msqrt></math>");
});

test("Displays n-roots", t => {
  t.is(a2ml("root n x"), "<math><mroot><mi>x</mi><mi>n</mi></mroot></math>");
});

test("Omits brackets in roots", t => {
  t.is(a2ml("sqrt(2)"), "<math><msqrt><mn>2</mn></msqrt></math>");
  t.is(a2ml("root(3)(2)"), "<math><mroot><mn>2</mn><mn>3</mn></mroot></math>");
});

test("Allows empty roots", t => {
  t.is(a2ml("sqrt"), "<math><msqrt><mrow></mrow></msqrt></math>");
  t.is(
    a2ml("root  "),
    "<math><mroot><mrow></mrow><mrow></mrow></mroot></math>"
  );
  t.is(a2ml("root 3 "), "<math><mroot><mrow></mrow><mn>3</mn></mroot></math>");
});

test("sqrt(2) ≈ 1.414", t => {
  t.is(
    a2ml("sqrt 2 ~~ 1.414213562"),
    "<math><msqrt><mn>2</mn></msqrt><mo>≈</mo><mn>1.414213562</mn></math>"
  );
});

test("Quadradic formula", t => {
  t.is(
    a2ml("x = (-b +- sqrt(b^2 - 4ac)) / 2a"),
    "<math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>±</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math>"
  );
});

test("Golden ratio (algebraic form)", t => {
  t.is(
    a2ml("phi = (1 + sqrt 5)/2"),
    "<math><mi>φ</mi><mo>=</mo><mfrac><mrow><mn>1</mn><mo>+</mo><msqrt><mn>5</mn></msqrt></mrow><mn>2</mn></mfrac></math>"
  );
});

test("Plastic number", t => {
  t.is(
    a2ml("rho = (root3(108 + 12 sqrt 69) + root3(108 - 12 sqrt 69)) / 6"),
    "<math><mi>ρ</mi><mo>=</mo><mfrac><mrow><mroot><mrow><mn>108</mn><mo>+</mo><mn>12</mn><msqrt><mn>69</mn></msqrt></mrow><mn>3</mn></mroot><mo>+</mo><mroot><mrow><mn>108</mn><mo>-</mo><mn>12</mn><msqrt><mn>69</mn></msqrt></mrow><mn>3</mn></mroot></mrow><mn>6</mn></mfrac></math>"
  );
});

test("Continued square root", t => {
  t.is(
    a2ml(
      "sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + cdots)))))))"
    ),
    "<math><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><mo>⋯</mo></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></math>"
  );
});
