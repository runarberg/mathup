import test from "ava";
import a2ml from "../src/index.js";

test("Column vectors", t => {
  t.is(
    a2ml("(1;2;3)"),
    '<math><mfenced open="(" close=")"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Matrices", t => {
  t.is(
    a2ml("[[a, b], [c, d]]"),
    '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Matrices with semicolon as a column separator", t => {
  t.is(
    a2ml("[[a; b]; [c; d]]", { decimalMark: "," }),
    a2ml("[[a, b], [c, d]]")
  );
});

test("Newlines instead of commas", t => {
  t.is(a2ml("[[a, b]\n [c, d]]"), a2ml("[[a, b], [c, d]]"));
  t.is(a2ml("[[a, b],\n [c, d]]"), a2ml("[[a, b], [c, d]]"));
});

test("Newlines instead of semicolons (w. `;` as colSep)", t => {
  t.is(a2ml("[[a; b]\n [c; d]]", { colSep: ";" }), a2ml("[[a, b], [c, d]]"));
  t.is(a2ml("[[a; b];\n [c; d]]", { colSep: ";" }), a2ml("[[a, b], [c, d]]"));
});

test("Matrices using comma, semicolon syntax", t => {
  t.is(
    a2ml("[1, 2, 3; 4, 5, 6]"),
    '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Trailing row brakes", t => {
  t.is(
    a2ml("[1, 2, 3;]"),
    '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></math>'
  );

  t.is(
    a2ml("[(1, 2, 3),]"),
    '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Newlines as row separators", t => {
  t.is(a2ml("[1, 2, 3\n 4, 5, 6]"), a2ml("[1, 2, 3; 4, 5, 6]"));
  t.is(a2ml("[a\n b\n c]"), a2ml("[a; b; c]"));
  t.is(a2ml("(4\n 6)"), a2ml("(4; 6)"));
});

test("Comma/semicolon takes precedence over bracket delimited matrices", t => {
  t.is(
    a2ml("[(a), (b); (c), (d)]"),
    '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mfenced open="(" close=")"><mi>a</mi></mfenced></mtd><mtd><mfenced open="(" close=")"><mi>b</mi></mfenced></mtd></mtr><mtr><mtd><mfenced open="(" close=")"><mi>c</mi></mfenced></mtd><mtd><mfenced open="(" close=")"><mi>d</mi></mfenced></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Newlines takes precedence over bracket delimited matrices", t => {
  t.is(
    a2ml("[(a), (b)\n (c), (d)]"),
    '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mfenced open="(" close=")"><mi>a</mi></mfenced></mtd><mtd><mfenced open="(" close=")"><mi>b</mi></mfenced></mtd></mtr><mtr><mtd><mfenced open="(" close=")"><mi>c</mi></mfenced></mtd><mtd><mfenced open="(" close=")"><mi>d</mi></mfenced></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Vertical bar delimited matrices", t => {
  t.is(
    a2ml("|(a,b,c), (d,e,f), (h,i,j)|"),
    '<math><mfenced open="|" close="|"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd><mtd><mi>c</mi></mtd></mtr><mtr><mtd><mi>d</mi></mtd><mtd><mi>e</mi></mtd><mtd><mi>f</mi></mtd></mtr><mtr><mtd><mi>h</mi></mtd><mtd><mi>i</mi></mtd><mtd><mi>j</mi></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Double vertical bar delimited matrices", t => {
  t.is(
    a2ml("|| a ; b ; c ||"),
    '<math><mfenced open="‖" close="‖"><mtable><mtr><mtd><mi>a</mi></mtd></mtr><mtr><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd></mtr></mtable></mfenced></math>'
  );
});

test("The general n×m matrix", t => {
  t.is(
    a2ml(
      "A = [[a_(1 1), a_(1 2), cdots, a_(1 n)], [a_(2 1), a_(2 2), cdots, a_(2 n)], [vdots, vdots, ddots, vdots], [a_(m 1), a_(m 2), cdots, a_(m n)]]"
    ),
    '<math><mi>A</mi><mo>=</mo><mfenced open="[" close="]"><mtable><mtr><mtd><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mn>2</mn></mrow></msub></mtd><mtd><mo>⋯</mo></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>2</mn><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mn>2</mn></mrow></msub></mtd><mtd><mo>⋯</mo></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mi>n</mi></mrow></msub></mtd></mtr><mtr><mtd><mo>⋮</mo></mtd><mtd><mo>⋮</mo></mtd><mtd><mo>⋱</mo></mtd><mtd><mo>⋮</mo></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mi>m</mi><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mi>m</mi><mn>2</mn></mrow></msub></mtd><mtd><mo>⋯</mo></mtd><mtd><msub><mi>a</mi><mrow><mi>m</mi><mi>n</mi></mrow></msub></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Nested matrices", t => {
  t.is(
    a2ml("[[((a, b), (d, e)), -1], [1, ((f, g), (h, i))]]"),
    '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mfenced open="(" close=")"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>d</mi></mtd><mtd><mi>e</mi></mtd></mtr></mtable></mfenced></mtd><mtd><mo>-</mo><mn>1</mn></mtd></mtr><mtr><mtd><mn>1</mn></mtd><mtd><mfenced open="(" close=")"><mtable><mtr><mtd><mi>f</mi></mtd><mtd><mi>g</mi></mtd></mtr><mtr><mtd><mi>h</mi></mtd><mtd><mi>i</mi></mtd></mtr></mtable></mfenced></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Single colomn vector", t => {
  t.is(
    a2ml("(a; b)"),
    '<math><mfenced open="(" close=")"><mtable><mtr><mtd><mi>a</mi></mtd></mtr><mtr><mtd><mi>b</mi></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Single row matrix", t => {
  t.is(
    a2ml("(a, b;)"),
    '<math><mfenced open="(" close=")"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr></mtable></mfenced></math>'
  );
});

test("The absolute value", t => {
  t.is(
    a2ml("|x| = { (x\\,, if x >= 0), (-x\\,, if x < 0) :}"),
    '<math><mfenced open="|" close="|"><mi>x</mi></mfenced><mo>=</mo><mfenced open="{" close=""><mtable columnalign="center left"><mtr><mtd><mi>x</mi><mo>,</mo></mtd><mtd><mo>if</mo><mi>x</mi><mo>≥</mo><mn>0</mn></mtd></mtr><mtr><mtd><mo>-</mo><mi>x</mi><mo>,</mo></mtd><mtd><mo>if</mo><mi>x</mi><mo>&lt;</mo><mn>0</mn></mtd></mtr></mtable></mfenced></math>'
  );
});

test("Factorial", t => {
  t.is(
    a2ml("n! = { [1,  if n=0 or n=1],  [n(n-1)!,  if n > 1] :}"),
    '<math><mrow><mi>n</mi><mo>!</mo></mrow><mo>=</mo><mfenced open="{" close=""><mtable columnalign="center left"><mtr><mtd><mn>1</mn></mtd><mtd><mo>if</mo><mi>n</mi><mo>=</mo><mn>0</mn><mo>or</mo><mi>n</mi><mo>=</mo><mn>1</mn></mtd></mtr><mtr><mtd><mi>n</mi><mfenced open="(" close=")"><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow></mfenced><mo>!</mo></mtd><mtd><mo>if</mo><mi>n</mi><mo>&gt;</mo><mn>1</mn></mtd></mtr></mtable></mfenced></math>'
  );
});
