import test from "ava";
import a2ml from "../src/index.js";

test("Should wrap all expressions in <math>", t => {
  t.is(a2ml(""), "<math></math>");
});

test("Should wrap numbers in <mn>", t => {
  t.is(a2ml("42"), "<math><mn>42</mn></math>");
});

test("Should wrap decimals in <mn>", t => {
  t.is(a2ml("3.141592654"), "<math><mn>3.141592654</mn></math>");
});

test("Should wrap identifiers in <mi>", t => {
  t.is(a2ml("x"), "<math><mi>x</mi></math>");
  t.is(a2ml("y"), "<math><mi>y</mi></math>");
  t.is(a2ml("a"), "<math><mi>a</mi></math>");
  t.is(a2ml("ni"), "<math><mi>n</mi><mi>i</mi></math>");
});

test("Should wrap operatos in <mo>", t => {
  t.is(a2ml("+"), "<math><mo>+</mo></math>");
  t.is(a2ml("-"), "<math><mo>-</mo></math>");
});

test("1+1 = 2", t => {
  t.is(
    a2ml("1+1 = 2"),
    "<math><mrow><mn>1</mn><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>2</mn></math>"
  );
});
test("3-2 = 1", t => {
  t.is(
    a2ml("3-2 = 1"),
    "<math><mrow><mn>3</mn><mo>-</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></math>"
  );
});
