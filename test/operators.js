import test from "ava";
import a2ml from "../index.es6.js";

test("Force operators with \\", t => {
  t.is(a2ml("\\^"), "<math><mo>^</mo></math>");
  t.is(a2ml("\\\\"), "<math><mo>\\</mo></math>");
});

test("Force long operator with \\(op) and \\[op]", t => {
  t.is(a2ml("\\(int)"), "<math><mo>int</mo></math>");
  t.is(a2ml("\\[(] \\([)"), "<math><mo>(</mo><mo>[</mo></math>");
  t.is(a2ml("\\((1))"), "<math><mo>(1)</mo></math>");
});

test("Only force an operator when \\ precedes a character", t => {
  t.is(a2ml("\\"), "<math><mi>\\</mi></math>");
});

test("i hat", t => {
  t.is(a2ml("ı.^\\^"), "<math><mover><mi>ı</mi><mo>^</mo></mover></math>");
});

test("The operator (n) as an overscript", t => {
  t.is(
    a2ml("x.^\\[(n)]"),
    "<math><mover><mi>x</mi><mo>(n)</mo></mover></math>"
  );
});

test("Sums", t => {
  t.is(
    a2ml("sum_(n=0)^k a_n = a_0 + a_i + cdots + a_k"),
    "<math><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mi>k</mi></munderover><msub><mi>a</mi><mi>n</mi></msub><mo>=</mo><msub><mi>a</mi><mn>0</mn></msub><mo>+</mo><msub><mi>a</mi><mi>i</mi></msub><mo>+</mo><mo>⋯</mo><mo>+</mo><msub><mi>a</mi><mi>k</mi></msub></math>"
  );
});

test("Function composition", t => {
  t.is(
    a2ml("bf`F` @ bf`G`  :  U sube RR^3 -> RR^2"),
    '<math><mi mathvariant="bold">F</mi><mo>∘</mo><mi mathvariant="bold">G</mi><mspace width="1ex" /><mo>:</mo><mspace width="1ex" /><mi>U</mi><mo>⊆</mo><msup><mi mathvariant="normal">ℝ</mi><mn>3</mn></msup><mo>→</mo><msup><mi mathvariant="normal">ℝ</mi><mn>2</mn></msup></math>'
  );
});

test("Eulers number", t => {
  t.is(
    a2ml("e = sum_(n=0)^oo 1 / n!"),
    '<math><mi>e</mi><mo>=</mo><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mi mathvariant="normal">∞</mi></munderover><mfrac><mn>1</mn><mrow><mi>n</mi><mo>!</mo></mrow></mfrac></math>'
  );
});

test("Remove space around derivatives", t => {
  t.is(
    a2ml("f'(x)"),
    '<math><mi>f</mi><mo lspace="0" rspace="0">′</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>'
  );
  t.is(
    a2ml("f''(x)"),
    '<math><mi>f</mi><mo lspace="0" rspace="0">″</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>'
  );
  t.is(
    a2ml("f'''(x)"),
    '<math><mi>f</mi><mo lspace="0" rspace="0">‴</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>'
  );
  t.is(
    a2ml("f''''(x)"),
    '<math><mi>f</mi><mo lspace="0" rspace="0">⁗</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>'
  );
});

test("Bayes theorem", t => {
  t.is(
    a2ml("p(a | b) = (p(b | a)p(a)) / p(b)"),
    '<math><mi>p</mi><mfenced open="(" close=")"><mrow><mi>a</mi><mo stretchy="true" lspace="veryverythickmathspace" rspace="veryverythickmathspace">|</mo><mi>b</mi></mrow></mfenced><mo>=</mo><mfrac><mrow><mi>p</mi><mfenced open="(" close=")"><mrow><mi>b</mi><mo stretchy="true" lspace="veryverythickmathspace" rspace="veryverythickmathspace">|</mo><mi>a</mi></mrow></mfenced><mi>p</mi><mfenced open="(" close=")"><mi>a</mi></mfenced></mrow><mrow><mi>p</mi><mfenced open="(" close=")"><mi>b</mi></mfenced></mrow></mfrac></math>'
  );
});

test("Gradient", t => {
  t.is(
    a2ml("grad f(x,y) = ((del f)/(del x) (x, y), (del f)/(del y) (x,y))"),
    '<math><mo rspace="0">∇</mo><mi>f</mi><mfenced open="(" close=")"><mi>x</mi><mi>y</mi></mfenced><mo>=</mo><mfenced open="(" close=")"><mrow><mfrac><mrow><mo rspace="0">∂</mo><mi>f</mi></mrow><mrow><mo rspace="0">∂</mo><mi>x</mi></mrow></mfrac><mfenced open="(" close=")"><mi>x</mi><mi>y</mi></mfenced></mrow><mrow><mfrac><mrow><mo rspace="0">∂</mo><mi>f</mi></mrow><mrow><mo rspace="0">∂</mo><mi>y</mi></mrow></mfrac><mfenced open="(" close=")"><mi>x</mi><mi>y</mi></mfenced></mrow></mfenced></math>'
  );
});

test("Taylor polynomial", t => {
  t.is(
    a2ml(
      "P_k(x) = f(a) + f'(a)(x-a) + (f''(a))/2! (x-a)^2 + cdots + (f^((k))(a))/k! (x-a)^k"
    ),
    '<math><msub><mi>P</mi><mi>k</mi></msub><mfenced open="(" close=")"><mi>x</mi></mfenced><mo>=</mo><mi>f</mi><mfenced open="(" close=")"><mi>a</mi></mfenced><mo>+</mo><mi>f</mi><mo lspace="0" rspace="0">′</mo><mfenced open="(" close=")"><mi>a</mi></mfenced><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>a</mi></mrow></mfenced><mo>+</mo><mfrac><mrow><mi>f</mi><mo lspace="0" rspace="0">″</mo><mfenced open="(" close=")"><mi>a</mi></mfenced></mrow><mrow><mn>2</mn><mo>!</mo></mrow></mfrac><msup><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>a</mi></mrow></mfenced><mn>2</mn></msup><mo>+</mo><mo>⋯</mo><mo>+</mo><mfrac><mrow><msup><mi>f</mi><mfenced open="(" close=")"><mi>k</mi></mfenced></msup><mfenced open="(" close=")"><mi>a</mi></mfenced></mrow><mrow><mi>k</mi><mo>!</mo></mrow></mfrac><msup><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>a</mi></mrow></mfenced><mi>k</mi></msup></math>'
  );
});

test("Strokes theorem", t => {
  t.is(
    a2ml("oint_(del S) bf`F` * dbf`s` = dint_S grad xx bf`F` * dbf`s`"),
    '<math><msub><mo>∮</mo><mrow><mo rspace="0">∂</mo><mi>S</mi></mrow></msub><mi mathvariant="bold">F</mi><mo>·</mo><mi>d</mi><mi mathvariant="bold">s</mi><mo>=</mo><msub><mo>∬</mo><mi>S</mi></msub><mo rspace="0">∇</mo><mo>×</mo><mi mathvariant="bold">F</mi><mo>·</mo><mi>d</mi><mi mathvariant="bold">s</mi></math>'
  );
});
