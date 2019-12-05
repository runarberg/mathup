import test from "ava";
import a2ml from "../src/index.js";

test("All accents", t => {
  t.is(
    a2ml("hat x"),
    '<math><mover><mi>x</mi><mo accent="true">^</mo></mover></math>'
  );

  t.is(
    a2ml("bar x"),
    '<math><mover><mi>x</mi><mo accent="true">‾</mo></mover></math>'
  );

  t.is(a2ml("ul x"), "<math><munder><mi>x</mi><mo>_</mo></munder></math>");

  t.is(
    a2ml("vec x"),
    '<math><mover><mi>x</mi><mo accent="true">→</mo></mover></math>'
  );

  t.is(
    a2ml("dot x"),
    '<math><mover><mi>x</mi><mo accent="true">⋅</mo></mover></math>'
  );

  t.is(
    a2ml("ddot x"),
    '<math><mover><mi>x</mi><mo accent="true">⋅⋅</mo></mover></math>'
  );

  t.is(
    a2ml("tilde x"),
    '<math><mover><mi>x</mi><mo accent="true">˜</mo></mover></math>'
  );

  t.is(
    a2ml("cancel x"),
    '<math><menclose notation="updiagonalstrike"><mi>x</mi></menclose></math>'
  );
});

test("Dottless i and dottless j under overscript accents", t => {
  t.is(
    a2ml("bar i"),
    '<math><mover><mi>ı</mi><mo accent="true">‾</mo></mover></math>'
  );

  t.is(
    a2ml("vec j"),
    '<math><mover><mi>ȷ</mi><mo accent="true">→</mo></mover></math>'
  );

  t.is(a2ml("ul i"), "<math><munder><mi>i</mi><mo>_</mo></munder></math>");
});

test("Should put accents over all the following parenthesis", t => {
  t.is(
    a2ml("3hat(xyz)"),
    '<math><mn>3</mn><mover><mrow><mi>x</mi><mi>y</mi><mi>z</mi></mrow><mo accent="true">^</mo></mover></math>'
  );
});

test("Physics vector notation", t => {
  t.is(
    a2ml("vec x = ahat i + bhat j + chat k"),
    '<math><mover><mi>x</mi><mo accent="true">→</mo></mover><mo>=</mo><mrow><mi>a</mi><mover><mi>ı</mi><mo accent="true">^</mo></mover></mrow><mo>+</mo><mrow><mi>b</mi><mover><mi>ȷ</mi><mo accent="true">^</mo></mover></mrow><mo>+</mo><mrow><mi>c</mi><mover><mi>k</mi><mo accent="true">^</mo></mover></mrow></math>'
  );
});
