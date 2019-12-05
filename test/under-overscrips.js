import test from "ava";
import a2ml from "../src/index.js";

test("Displays underscripts", t => {
  t.is(a2ml("X._a"), "<math><munder><mi>X</mi><mi>a</mi></munder></math>");
});

test("Displays overscripts", t => {
  t.is(a2ml("X.^a"), "<math><mover><mi>X</mi><mi>a</mi></mover></math>");
});

test("Displays under-overscripts", t => {
  t.is(
    a2ml("X.^a._b"),
    "<math><munderover><mi>X</mi><mi>b</mi><mi>a</mi></munderover></math>"
  );
});

test("Allows trailing under or overscripts", t => {
  t.is(a2ml("a.^"), "<math><mover><mi>a</mi><mrow></mrow></mover></math>");
  t.is(a2ml("b._  "), "<math><munder><mi>b</mi><mrow></mrow></munder></math>");
});

test("Allows trailing under-overscript", t => {
  t.notThrows(() => a2ml("a._i .^"));
  t.notThrows(() => a2ml("a._i .^"));
  t.notThrows(() => a2ml("a._i  ^"));
  t.notThrows(() => a2ml("a.^2._"));
  t.notThrows(() => a2ml("a.^2_ "));
});

test("Goes under limits", t => {
  t.is(
    a2ml("lim_(a -> b)"),
    "<math><munder><mi>lim</mi><mrow><mi>a</mi><mo>→</mo><mi>b</mi></mrow></munder></math>"
  );

  t.is(
    a2ml("lim_(a->b)"),
    "<math><munder><mi>lim</mi><mrow><mi>a</mi><mo>→</mo><mi>b</mi></mrow></munder></math>"
  );
});

test("Goes over and under sums", t => {
  t.is(
    a2ml("sum_(i=0)^n"),
    "<math><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>0</mn></mrow><mi>n</mi></munderover></math>"
  );

  t.is(
    a2ml("sum^n_(i=0)"),
    "<math><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>0</mn></mrow><mi>n</mi></munderover></math>"
  );
});

test("Goes over and under products", t => {
  t.is(
    a2ml("prod_(i=1)^n"),
    "<math><munderover><mo>∏</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover></math>"
  );
  t.is(
    a2ml("prod^n_(i=1)"),
    "<math><munderover><mo>∏</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover></math>"
  );
});

test("Golden ratio (defenition)", t => {
  t.is(
    a2ml('phi =.^"def" a/b = (a+b)/a'),
    "<math><mi>φ</mi><mover><mo>=</mo><mtext>def</mtext></mover><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>=</mo><mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mi>a</mi></mfrac></math>"
  );
});

test("Matrix dimentions", t => {
  t.is(
    a2ml("X._(n xx m)"),
    "<math><munder><mi>X</mi><mrow><mi>n</mi><mo>×</mo><mi>m</mi></mrow></munder></math>"
  );
});

test("k times x", t => {
  t.is(
    a2ml('{: x + ... + x :}.^⏞.^(k  "times")'),
    '<math><mover><mfenced open="" close=""><mrow><mi>x</mi><mo>+</mo><mo>…</mo><mo>+</mo><mi>x</mi></mrow></mfenced><mover><mo>⏞</mo><mrow><mi>k</mi><mspace width="1ex" /><mtext>times</mtext></mrow></mover></mover></math>'
  );
});
