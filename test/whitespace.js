import test from "ava";
import a2ml from "../src/index.js";

test("More then one subsequent whitespace keeps", t => {
  t.is(a2ml("a  b"), '<math><mi>a</mi><mspace width="1ex" /><mi>b</mi></math>');
  t.is(a2ml("a b"), "<math><mi>a</mi><mi>b</mi></math>");
});

test("One whitespace char truncates", t => {
  const expected = a2ml("ab");

  t.is(a2ml("a b"), expected);
  t.not(a2ml("a  b"), expected);
});

test("Whitespace count follows the equation `n-1 ex`", t => {
  t.is(a2ml("a  b"), '<math><mi>a</mi><mspace width="1ex" /><mi>b</mi></math>');
  t.is(
    a2ml("a   b"),
    '<math><mi>a</mi><mspace width="2ex" /><mi>b</mi></math>',
  );
  t.is(
    a2ml(`a${" ".repeat(20)}b`),
    '<math><mi>a</mi><mspace width="19ex" /><mi>b</mi></math>',
  );
});

test("Adjacent symbols on either side of whitespace gets wrapped in an <mrow>", t => {
  t.is(
    a2ml("ab cd"),
    "<math><mrow><mi>a</mi><mi>b</mi></mrow><mi>c</mi><mi>d</mi></math>",
  );
});

test("But not straight after a function", t => {
  t.is(
    a2ml("sin (a + b)"),
    '<math><mi>sin</mi><mfenced open="(" close=")"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mfenced></math>',
  );
});

test("An <mspace> should not cause trouble in fences", t => {
  t.notThrows(() => a2ml("(a     ]"));
  t.notThrows(() => a2ml("(a     ,   b    ,     ]"));
  t.notThrows(() => a2ml("(a     ,   b    ,     c]"));
});
