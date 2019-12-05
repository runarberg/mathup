import test from "ava";
import a2ml from "../src/index.js";

test("Unicode numerals", t => {
  t.is(a2ml("四十二"), "<math><mn>四十二</mn></math>");
  t.is(
    a2ml("٣٫١٤١٥٩٢٦٥", { decimalMark: "٫" }),
    "<math><mn>٣٫١٤١٥٩٢٦٥</mn></math>"
  );
});

test("Numbers with #`...`", t => {
  t.is(a2ml("#`0x2A`"), "<math><mn>0x2A</mn></math>");
  t.is(a2ml("#`XLII`"), "<math><mn>XLII</mn></math>");
});

test("Duodecimals", t => {
  t.is(
    a2ml("1/2 + 1/3 = 5/6 = 0.\u218A, 2/3 + 1/4 = \u218B/10 = 0.\u218B"),
    "<math><mfrac><mn>1</mn><mn>2</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>3</mn></mfrac><mo>=</mo><mfrac><mn>5</mn><mn>6</mn></mfrac><mo>=</mo><mn>0.\u218A</mn><mo>,</mo><mfrac><mn>2</mn><mn>3</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>4</mn></mfrac><mo>=</mo><mfrac><mn>\u218B</mn><mn>10</mn></mfrac><mo>=</mo><mn>0.\u218B</mn></math>"
  );
});

test("al-Khwarizmi", t => {
  t.is(
    a2ml("(١٠ - ح)^٢ = ٨١ح", { dir: "rtl" }),
    '<math dir="rtl"><msup><mfenced open="(" close=")"><mrow><mn>١٠</mn><mo>-</mo><mi>ح</mi></mrow></mfenced><mn>٢</mn></msup><mo>=</mo><mn>٨١</mn><mi>ح</mi></math>'
  );
});

test("Hex to RGB", t => {
  t.is(
    a2ml("#`#3094AB` == `rgb`(48, 148, 171)"),
    '<math><mn>#3094AB</mn><mo>≡</mo><mi>rgb</mi><mfenced open="(" close=")"><mn>48</mn><mn>148</mn><mn>171</mn></mfenced></math>'
  );

  t.is(
    a2ml("`rgb`(48, 148, 171) == #`#3094AB`"),
    '<math><mi>rgb</mi><mfenced open="(" close=")"><mn>48</mn><mn>148</mn><mn>171</mn></mfenced><mo>≡</mo><mn>#3094AB</mn></math>'
  );
});

test("Forty two", t => {
  t.is(
    a2ml("#`0x2A` = #`XLII` = #`4.2e+01` = #`forty two` = 42"),
    "<math><mn>0x2A</mn><mo>=</mo><mn>XLII</mn><mo>=</mo><mn>4.2e+01</mn><mo>=</mo><mn>forty two</mn><mo>=</mo><mn>42</mn></math>"
  );
});
