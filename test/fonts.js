import test from "ava";
import a2ml from "../index.es6.js";

test("Double quoted as text", t => {
  t.is(a2ml('"alpha"'), "<math><mtext>alpha</mtext></math>");
});

test("Backtick surrounded as identifiers", t => {
  t.is(
    a2ml("`Gamma` != Gamma"),
    '<math><mi>Gamma</mi><mo>≠</mo><mi mathvariant="normal">Γ</mi></math>'
  );
  t.is(a2ml("`1`"), "<math><mi>1</mi></math>");
});

test("Mathvariants for texts", t => {
  t.is(a2ml('rm"abc"'), '<math><mtext mathvariant="normal">abc</mtext></math>');
  t.is(a2ml('it"abc"'), '<math><mtext mathvariant="italic">abc</mtext></math>');
  t.is(a2ml('bf"abc"'), '<math><mtext mathvariant="bold">abc</mtext></math>');
  t.is(
    a2ml('bb"abc"'),
    '<math><mtext mathvariant="double-struck">abc</mtext></math>'
  );
  t.is(a2ml('cc"abc"'), '<math><mtext mathvariant="script">abc</mtext></math>');
  t.is(
    a2ml('fr"abc"'),
    '<math><mtext mathvariant="fraktur">abc</mtext></math>'
  );
  t.is(
    a2ml('sf"abc"'),
    '<math><mtext mathvariant="sans-serif">abc</mtext></math>'
  );
  t.is(
    a2ml('tt"abc"'),
    '<math><mtext mathvariant="monospace">abc</mtext></math>'
  );
});

test("Space after the variant label", t => {
  t.is(
    a2ml('rm "abc"'),
    '<math><mtext mathvariant="normal">abc</mtext></math>'
  );

  t.is(
    a2ml('it "abc"'),
    '<math><mtext mathvariant="italic">abc</mtext></math>'
  );

  t.is(a2ml('bf "abc"'), '<math><mtext mathvariant="bold">abc</mtext></math>');

  t.is(
    a2ml('bb "abc"'),
    '<math><mtext mathvariant="double-struck">abc</mtext></math>'
  );

  t.is(
    a2ml('cc "abc"'),
    '<math><mtext mathvariant="script">abc</mtext></math>'
  );

  t.is(
    a2ml('fr "abc"'),
    '<math><mtext mathvariant="fraktur">abc</mtext></math>'
  );

  t.is(
    a2ml('sf "abc"'),
    '<math><mtext mathvariant="sans-serif">abc</mtext></math>'
  );

  t.is(
    a2ml('tt "abc"'),
    '<math><mtext mathvariant="monospace">abc</mtext></math>'
  );
});

test("Mathvariants for identifiers", t => {
  t.is(a2ml("rm`abc`"), '<math><mi mathvariant="normal">abc</mi></math>');
  t.is(a2ml("it`abc`"), '<math><mi mathvariant="italic">abc</mi></math>');
  t.is(a2ml("bf`abc`"), '<math><mi mathvariant="bold">abc</mi></math>');
  t.is(
    a2ml("bb`abc`"),
    '<math><mi mathvariant="double-struck">abc</mi></math>'
  );
  t.is(a2ml("cc`abc`"), '<math><mi mathvariant="script">abc</mi></math>');
  t.is(a2ml("fr`abc`"), '<math><mi mathvariant="fraktur">abc</mi></math>');
  t.is(a2ml("sf`abc`"), '<math><mi mathvariant="sans-serif">abc</mi></math>');
  t.is(a2ml("tt`abc`"), '<math><mi mathvariant="monospace">abc</mi></math>');
});

test("Mathvariants for identifiers with space after variant", t => {
  t.is(a2ml("rm `abc`"), '<math><mi mathvariant="normal">abc</mi></math>');
  t.is(a2ml("it `abc`"), '<math><mi mathvariant="italic">abc</mi></math>');
  t.is(a2ml("bf `abc`"), '<math><mi mathvariant="bold">abc</mi></math>');
  t.is(
    a2ml("bb `abc`"),
    '<math><mi mathvariant="double-struck">abc</mi></math>'
  );
  t.is(a2ml("cc `abc`"), '<math><mi mathvariant="script">abc</mi></math>');
  t.is(a2ml("fr `abc`"), '<math><mi mathvariant="fraktur">abc</mi></math>');
  t.is(a2ml("sf `abc`"), '<math><mi mathvariant="sans-serif">abc</mi></math>');
  t.is(a2ml("tt `abc`"), '<math><mi mathvariant="monospace">abc</mi></math>');
});
