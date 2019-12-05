import test from "ava";
import a2ml from "../index.es6.js";

test("Groups brackets together", t => {
  t.is(
    a2ml("(a+b)"),
    '<math><mfenced open="(" close=")"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mfenced></math>'
  );
});

test("Handles comma seperated lists", t => {
  t.is(
    a2ml("a,b,c"),
    "<math><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi></math>"
  );
});

test("Adds parentesis around parentesized comma seperated lists", t => {
  t.is(
    a2ml("(a,b,c)"),
    '<math><mfenced open="(" close=")"><mi>a</mi><mi>b</mi><mi>c</mi></mfenced></math>'
  );
});

test("Allows unclosed fences", t => {
  t.is(
    a2ml("(a"),
    '<math><mfenced open="(" close=""><mi>a</mi></mfenced></math>'
  );
  t.is(
    a2ml("((a)"),
    '<math><mfenced open="(" close=""><mfenced open="(" close=")"><mi>a</mi></mfenced></mfenced></math>'
  );
  t.is(
    a2ml("[("),
    '<math><mfenced open="[" close=""><mfenced open="(" close=""></mfenced></mfenced></math>'
  );
});

test("Complex groupings", t => {
  t.is(
    a2ml("abs(x)"),
    '<math><mfenced open="|" close="|"><mi>x</mi></mfenced></math>'
  );

  t.is(
    a2ml("floor(x)"),
    '<math><mfenced open="⌊" close="⌋"><mi>x</mi></mfenced></math>'
  );

  t.is(
    a2ml("ceil(x)"),
    '<math><mfenced open="⌈" close="⌉"><mi>x</mi></mfenced></math>'
  );

  t.is(
    a2ml("norm(x)"),
    '<math><mfenced open="∥" close="∥"><mi>x</mi></mfenced></math>'
  );

  t.is(
    a2ml("abs x"),
    '<math><mfenced open="|" close="|"><mi>x</mi></mfenced></math>'
  );

  t.is(
    a2ml("floor x"),
    '<math><mfenced open="⌊" close="⌋"><mi>x</mi></mfenced></math>'
  );

  t.is(
    a2ml("ceil x"),
    '<math><mfenced open="⌈" close="⌉"><mi>x</mi></mfenced></math>'
  );

  t.is(
    a2ml("norm x"),
    '<math><mfenced open="∥" close="∥"><mi>x</mi></mfenced></math>'
  );
});

test("Simplify polynomials", t => {
  t.is(
    a2ml("(x+y)(x-y) = x^2-y^2"),
    '<math><mfenced open="(" close=")"><mrow><mi>x</mi><mo>+</mo><mi>y</mi></mrow></mfenced><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>y</mi></mrow></mfenced><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>-</mo><msup><mi>y</mi><mn>2</mn></msup></math>'
  );
});

test("Exponential decay", t => {
  t.is(
    a2ml("e^(-x)"),
    "<math><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></math>"
  );
});

test("Eulers identity", t => {
  t.is(
    a2ml("e^(i tau) = 1"),
    "<math><msup><mi>e</mi><mrow><mi>i</mi><mi>τ</mi></mrow></msup><mo>=</mo><mn>1</mn></math>"
  );
});

test("The natural numbers", t => {
  t.is(
    a2ml("NN = {1, 2, 3, ...}"),
    '<math><mi mathvariant="normal">ℕ</mi><mo>=</mo><mfenced open="{" close="}"><mn>1</mn><mn>2</mn><mn>3</mn><mo>…</mo></mfenced></math>'
  );
});

test("Average over time", t => {
  t.is(
    a2ml("(: V(t)^2 :) = lim_(T->oo) 1/T int_(-T./2)^(T./2) V(t)^2 dt"),
    '<math><mfenced open="⟨" close="⟩"><mrow><mi>V</mi><msup><mfenced open="(" close=")"><mi>t</mi></mfenced><mn>2</mn></msup></mrow></mfenced><mo>=</mo><munder><mi>lim</mi><mrow><mi>T</mi><mo>→</mo><mi mathvariant="normal">∞</mi></mrow></munder><mfrac><mn>1</mn><mi>T</mi></mfrac><msubsup><mo>∫</mo><mrow><mo>-</mo><mfrac bevelled="true"><mi>T</mi><mn>2</mn></mfrac></mrow><mfrac bevelled="true"><mi>T</mi><mn>2</mn></mfrac></msubsup><mi>V</mi><msup><mfenced open="(" close=")"><mi>t</mi></mfenced><mn>2</mn></msup><mi>d</mi><mi>t</mi></math>'
  );
});
