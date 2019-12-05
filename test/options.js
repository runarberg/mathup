import test from "ava";
import a2ml from "../index.es6.js";

test("Display block, when passed in", t => {
  t.is(a2ml("", { display: "block" }), '<math display="block"></math>');
});

test("right-to-left direction when passed in", t => {
  t.is(a2ml("", { dir: "rtl" }), '<math dir="rtl"></math>');
});

test("Should be able to be both at the same time", t => {
  t.is(
    a2ml("", { display: "block", dir: "rtl" }),
    '<math display="block" dir="rtl"></math>'
  );
});

test("Bare does’t wrap in `<math>` element", t => {
  t.is(a2ml("42", { bare: true }), "<mn>42</mn>");
});

test("Standalone gives a valid HTML page", t => {
  t.is(
    a2ml("42", { standalone: true }),
    "<!DOCTYPE html><html><head><title>42</title></head><body><math><mn>42</mn></math></body></html>"
  );
});

test("Annotated", t => {
  t.is(
    a2ml("42", { annotate: true }),
    '<math><semantics><mn>42</mn><annotation encoding="application/AsciiMath">42</annotation></semantics></math>'
  );
});

test("Annotated give a single math element", t => {
  t.is(
    a2ml("40 + 2 = 42", { annotate: true }),
    '<math><semantics><mrow><mn>40</mn><mo>+</mo><mn>2</mn><mo>=</mo><mn>42</mn></mrow><annotation encoding="application/AsciiMath">40 + 2 = 42</annotation></semantics></math>'
  );
});

test("Throws when bare and standalone at the same time", t => {
  t.throws(() => a2ml("42", { bare: true, standalone: true }));
});

test('Throws when bare and display="block"', t => {
  t.throws(() => a2ml("42", { bare: true, display: "block" }));
  t.throws(() => a2ml("42", { bare: true, display: "BloCK" }));
});

test('Nor dir="rtl"', t => {
  t.throws(() => a2ml("42", { bare: true, dir: "rtl" }));
  t.throws(() => a2ml("42", { bare: true, dir: "RTL" }));
});

test("Curry when called with an object", t => {
  const curried = a2ml({ display: "block" });

  t.is(curried(""), '<math display="block"></math>');
  t.is(
    curried("42", { annotate: true, standalone: true }),
    '<!DOCTYPE html><html><head><title>42</title></head><body><math display="block"><semantics><mn>42</mn><annotation encoding="application/AsciiMath">42</annotation></semantics></math></body></html>'
  );
  t.is(
    a2ml("42", { annotate: true, standalone: true }),
    '<!DOCTYPE html><html><head><title>42</title></head><body><math><semantics><mn>42</mn><annotation encoding="application/AsciiMath">42</annotation></semantics></math></body></html>'
  );
});

test("Comma as a decimal mark", t => {
  const math = a2ml({ decimalMark: ",", bare: true });

  t.is(math("40,2"), "<mn>40,2</mn>");
  t.is(math("40,2/13,3"), "<mfrac><mn>40,2</mn><mn>13,3</mn></mfrac>");
  t.is(math("2^0,5"), "<msup><mn>2</mn><mn>0,5</mn></msup>");
});

test('Column separators default to ";" when decimal marks are ","', t => {
  const math = a2ml({ decimalMark: ",", bare: true });

  t.is(
    math("(1; 2; 3,14)"),
    '<mfenced open="(" close=")" separators=";"><mn>1</mn><mn>2</mn><mn>3,14</mn></mfenced>'
  );
});

test('Row separators default to ";;" when column separators are ";"', t => {
  const math = a2ml({ bare: true });

  t.is(
    math("[1 ;; 2 ;; 3.14]", { colSep: ";" }),
    '<mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3.14</mn></mtd></mtr></mtable></mfenced>'
  );

  t.is(
    math("[1 ;; 2 ;; 3,14]", { decimalMark: "," }),
    '<mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3,14</mn></mtd></mtr></mtable></mfenced>'
  );
});

test("Arbitrary column separators", t => {
  const math = a2ml({ bare: true });

  t.is(
    math("(1 | 2 | 3.14)", { colSep: "|" }),
    '<mfenced open="(" close=")" separators="|"><mn>1</mn><mn>2</mn><mn>3.14</mn></mfenced>'
  );

  t.is(
    math("(1; 2; 3,14)", { colSep: ";", decimalMark: "," }),
    '<mfenced open="(" close=")" separators=";"><mn>1</mn><mn>2</mn><mn>3,14</mn></mfenced>'
  );
});

test("Arbitrary row separators", t => {
  const math = a2ml({ bare: true });

  t.is(
    math("(1 & 2 & 3.14)", { rowSep: "&" }),
    '<mfenced open="(" close=")"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3.14</mn></mtd></mtr></mtable></mfenced>'
  );

  t.is(
    math("(1 \\\\ 2 \\\\ 3,14)", { rowSep: "\\\\", decimalMark: "," }),
    '<mfenced open="(" close=")"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3,14</mn></mtd></mtr></mtable></mfenced>'
  );
});
