import test from "ava";
import a2ml from "../index.es6.js";

test("Standard functions are identifiers", t => {
  t.is(a2ml("sin"), "<math><mi>sin</mi></math>");
  t.is(a2ml("cos"), "<math><mi>cos</mi></math>");
  t.is(a2ml("tan"), "<math><mi>tan</mi></math>");
  t.is(a2ml("csc"), "<math><mi>csc</mi></math>");
  t.is(a2ml("sec"), "<math><mi>sec</mi></math>");
  t.is(a2ml("cot"), "<math><mi>cot</mi></math>");
  t.is(a2ml("sinh"), "<math><mi>sinh</mi></math>");
  t.is(a2ml("cosh"), "<math><mi>cosh</mi></math>");
  t.is(a2ml("tanh"), "<math><mi>tanh</mi></math>");
  t.is(a2ml("log"), "<math><mi>log</mi></math>");
  t.is(a2ml("ln"), "<math><mi>ln</mi></math>");
  t.is(a2ml("det"), "<math><mi>det</mi></math>");
  t.is(a2ml("dim"), "<math><mi>dim</mi></math>");
  t.is(a2ml("lim"), "<math><mi>lim</mi></math>");
  t.is(a2ml("mod"), "<math><mi>mod</mi></math>");
  t.is(a2ml("gcd"), "<math><mi>gcd</mi></math>");
  t.is(a2ml("lcm"), "<math><mi>lcm</mi></math>");
  t.is(a2ml("min"), "<math><mi>min</mi></math>");
  t.is(a2ml("max"), "<math><mi>max</mi></math>");
});

test("Tangent = Sinus over Cosinus", t => {
  t.is(
    a2ml("tan = sin/cos"),
    "<math><mrow><mi>tan</mi><mo>=</mo></mrow><mfrac><mi>sin</mi><mi>cos</mi></mfrac></math>"
  );
});

test("The hyperbolic functions", t => {
  t.is(
    a2ml(
      "sinh x = (e^x - e^(-x))/2, cosh x = (e^x + e^(-x))/2, tanh x = (sinh x)/(cosh x)"
    ),
    "<math><mrow><mi>sinh</mi><mi>x</mi></mrow><mo>=</mo><mfrac><mrow><msup><mi>e</mi><mi>x</mi></msup><mo>-</mo><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></mrow><mn>2</mn></mfrac><mo>,</mo><mrow><mi>cosh</mi><mi>x</mi></mrow><mo>=</mo><mfrac><mrow><msup><mi>e</mi><mi>x</mi></msup><mo>+</mo><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></mrow><mn>2</mn></mfrac><mo>,</mo><mrow><mi>tanh</mi><mi>x</mi></mrow><mo>=</mo><mfrac><mrow><mi>sinh</mi><mi>x</mi></mrow><mrow><mi>cosh</mi><mi>x</mi></mrow></mfrac></math>"
  );
});

test("Logarithm change of base", t => {
  t.is(
    a2ml("log_b x = (log_k x)/(log_k b)"),
    "<math><msub><mi>log</mi><mi>b</mi></msub><mi>x</mi><mo>=</mo><mfrac><mrow><msub><mi>log</mi><mi>k</mi></msub><mi>x</mi></mrow><mrow><msub><mi>log</mi><mi>k</mi></msub><mi>b</mi></mrow></mfrac></math>"
  );
});

test("Logarithm powers", t => {
  t.is(
    a2ml("ln x^2 = 2 ln x"),
    "<math><mrow><mi>ln</mi><msup><mi>x</mi><mn>2</mn></msup></mrow><mo>=</mo><mn>2</mn><mrow><mi>ln</mi><mi>x</mi></mrow></math>"
  );
});

test("Logarithm division", t => {
  t.is(
    a2ml("ln(x/y) = ln x - ln y"),
    '<math><mi>ln</mi><mfenced open="(" close=")"><mfrac><mi>x</mi><mi>y</mi></mfrac></mfenced><mo>=</mo><mrow><mi>ln</mi><mi>x</mi></mrow><mo>-</mo><mrow><mi>ln</mi><mi>y</mi></mrow></math>'
  );
});

test("2×2 determinants", t => {
  t.is(
    a2ml("det(A) = |(a, b), (c, d)| = ad - cd"),
    '<math><mi>det</mi><mfenced open="(" close=")"><mi>A</mi></mfenced><mo>=</mo><mfenced open="|" close="|"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable></mfenced><mo>=</mo><mrow><mi>a</mi><mi>d</mi></mrow><mo>-</mo><mi>c</mi><mi>d</mi></math>'
  );
});

test("Fermats little theorem", t => {
  t.is(
    a2ml("a^(p-1) -= 1   (mod p)"),
    '<math><msup><mi>a</mi><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow></msup><mo>≡</mo><mn>1</mn><mspace width="2ex" /><mfenced open="(" close=")"><mrow><mi>mod</mi><mi>p</mi></mrow></mfenced></math>'
  );
});
