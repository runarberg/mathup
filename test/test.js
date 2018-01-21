"use strict";

var ascii2mathml = require("../index.js");
var expect = require("expect.js");

var test = function(ascii, mathml) {
  return expect(ascii2mathml(ascii)).to.be(mathml);
};

test.with = function(options) {
  return function(ascii, mathml) {
    return expect(ascii2mathml(ascii, options)).to.be(mathml);
  };
};


describe('Options', function() {
  it('Should display block, when passed in', function() {
    expect(ascii2mathml("", {display: "block"}))
      .to.be('<math display="block"></math>');
  });

  it('Should have right-to-left direction when passed in', function() {
    expect(ascii2mathml("", {dir: "rtl"}))
      .to.be('<math dir="rtl"></math>');
  });

  it('Should be able to be both at the same time', function() {
    expect(ascii2mathml("", {display: "block", dir: "rtl"}))
      .to.be('<math display="block" dir="rtl"></math>');
  });

  it('Should be bare when passed in', function() {
    expect(ascii2mathml("42", {bare: true}))
      .to.be('<mn>42</mn>');
  });

  it('Should be a valid HTML page when passed as standalone', function() {
    expect(ascii2mathml("42", {standalone: true}))
      .to.be('<!DOCTYPE html><html><head><title>42</title></head><body><math><mn>42</mn></math></body></html>');
  });

  it('Should be annotated when passed in', function() {
    expect(ascii2mathml("42", {annotate: true}))
      .to.be('<math><semantics><mn>42</mn><annotation encoding="application/AsciiMath">42</annotation></semantics></math>');
  });

  it('Should have one math element when annotated', function() {
    expect(ascii2mathml("40 + 2 = 42", {annotate: true}))
      .to.be('<math><semantics><mrow><mn>40</mn><mo>+</mo><mn>2</mn><mo>=</mo><mn>42</mn></mrow><annotation encoding="application/AsciiMath">40 + 2 = 42</annotation></semantics></math>');
  });

  it('Should not be allowed to be bare and standalone at the same time', function() {
    expect(ascii2mathml)
      .withArgs("42", {bare: true, standalone: true})
      .to.throwException();
  });

  it('Nor bare and display="block"', function() {
    expect(ascii2mathml)
      .withArgs("42", {bare: true, display: "block"})
      .to.throwException();
    expect(ascii2mathml)
      .withArgs("42", {bare: true, display: "BloCK"})
      .to.throwException();
  });

  it('Nor dir="rtl"', function() {
    expect(ascii2mathml)
      .withArgs("42", {bare: true, dir: "rtl"})
      .to.throwException();
    expect(ascii2mathml)
      .withArgs("42", {bare: true, dir: "RTL"})
      .to.throwException();
  });

  it('Should be curried when called with an object', function() {
    var curried = ascii2mathml({display: "block"});
    
    expect(curried(''))
      .to.be('<math display="block"></math>');
    expect(curried('42', {annotate: true, standalone: true}))
      .to.be('<!DOCTYPE html><html><head><title>42</title></head><body><math display="block"><semantics><mn>42</mn><annotation encoding="application/AsciiMath">42</annotation></semantics></math></body></html>');
    expect(ascii2mathml('42', {annotate: true, standalone: true}))
      .to.be('<!DOCTYPE html><html><head><title>42</title></head><body><math><semantics><mn>42</mn><annotation encoding="application/AsciiMath">42</annotation></semantics></math></body></html>');
  });

  it('Should allow comma as a decimal mark', function() {
    var math = ascii2mathml({decimalMark: ',', bare: true});
    expect(math("40,2")).to.be('<mn>40,2</mn>');
    expect(math("40,2/13,3")).to.be('<mfrac><mn>40,2</mn><mn>13,3</mn></mfrac>');
    expect(math("2^0,5")).to.be('<msup><mn>2</mn><mn>0,5</mn></msup>');
  });

  it('Should default column separators to ";" when decimal marks are ","', function() {
    var math = ascii2mathml({decimalMark: ',', bare: true});
    expect(math('(1; 2; 3,14)'))
      .to.be('<mfenced open="(" close=")" separators=";"><mn>1</mn><mn>2</mn><mn>3,14</mn></mfenced>');
  });

  it('Should default row separators to ";;" when column separators are ";"', function() {
    var math = ascii2mathml({bare: true});
    expect(math('[1 ;; 2 ;; 3.14]', {colSep: ';'}))
      .to.be('<mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3.14</mn></mtd></mtr></mtable></mfenced>');
    expect(math('[1 ;; 2 ;; 3,14]', {decimalMark: ','}))
      .to.be('<mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3,14</mn></mtd></mtr></mtable></mfenced>');
  });

  it('Should allow arbitrary column separators', function() {
    var math = ascii2mathml({bare: true});
    expect(math('(1 | 2 | 3.14)', {colSep: '|'}))
      .to.be('<mfenced open="(" close=")" separators="|"><mn>1</mn><mn>2</mn><mn>3.14</mn></mfenced>');
    expect(math('(1; 2; 3,14)', {colSep: ';', decimalMark: ','}))
      .to.be('<mfenced open="(" close=")" separators=";"><mn>1</mn><mn>2</mn><mn>3,14</mn></mfenced>');
  });

  it('Should allow arbitrary row separators', function() {
    var math = ascii2mathml({bare: true});
    expect(math('(1 & 2 & 3.14)', {rowSep: '&'}))
      .to.be('<mfenced open="(" close=")"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3.14</mn></mtd></mtr></mtable></mfenced>');
   expect(math('(1 \\\\ 2 \\\\ 3,14)', {rowSep: '\\\\', decimalMark: ','}))
     .to.be('<mfenced open="(" close=")"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3,14</mn></mtd></mtr></mtable></mfenced>');
  });
});


describe('basics', function() {
  it('Should wrap all expressions in <math>', function() {
    test("", "<math></math>");
  });
  it('Should wrap numbers in <mn>', function() {
    test("42", "<math><mn>42</mn></math>");
  });
  it('Should wrap decimals in <mn>', function() {
    test("3.141592654", "<math><mn>3.141592654</mn></math>");
  });
  it('Should wrap identifiers in <mi>', function() {
    test("x", "<math><mi>x</mi></math>");
    test("y", "<math><mi>y</mi></math>");
    test("a", "<math><mi>a</mi></math>");
    test("ni", "<math><mi>n</mi><mi>i</mi></math>");
  });
  it("Should wrap operatos in <mo>", function() {
    test("+", "<math><mo>+</mo></math>");
    test("-", "<math><mo>-</mo></math>");
  });

  it('1+1 = 2', function() {
    test("1+1 = 2", "<math><mrow><mn>1</mn><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>2</mn></math>");
  });
  it('3-2 = 1', function() {
    test("3-2 = 1", "<math><mrow><mn>3</mn><mo>-</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></math>");
  });
});


describe('Numbers', function() {
  it('Should accept unicode numerals', function() {
    test("四十二", "<math><mn>四十二</mn></math>");
    expect(ascii2mathml("٣٫١٤١٥٩٢٦٥", {decimalMark: "٫"}))
      .to.be("<math><mn>٣٫١٤١٥٩٢٦٥</mn></math>");
  });

  it('Should force numbers with #`...`', function() {
    test("#`0x2A`", "<math><mn>0x2A</mn></math>");
    test("#`XLII`", "<math><mn>XLII</mn></math>");
  });

  it("Duodecimals", function() {
    test("1/2 + 1/3 = 5/6 = 0.\u218A, 2/3 + 1/4 = \u218B/10 = 0.\u218B",
         "<math><mfrac><mn>1</mn><mn>2</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>3</mn></mfrac><mo>=</mo><mfrac><mn>5</mn><mn>6</mn></mfrac><mo>=</mo><mn>0.\u218A</mn><mo>,</mo><mfrac><mn>2</mn><mn>3</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>4</mn></mfrac><mo>=</mo><mfrac><mn>\u218B</mn><mn>10</mn></mfrac><mo>=</mo><mn>0.\u218B</mn></math>");
  });

  it('al-Khwarizmi', function() {
    test.with({dir: 'rtl'})(
      "(١٠ - ح)^٢ = ٨١ح",
      '<math dir="rtl"><msup><mfenced open="(" close=")"><mrow><mn>١٠</mn><mo>-</mo><mi>ح</mi></mrow></mfenced><mn>٢</mn></msup><mo>=</mo><mn>٨١</mn><mi>ح</mi></math>'
    );
  });

  it("Hex to RGB", function() {
    test("#`#3094AB` == `rgb`(48, 148, 171)",
         '<math><mn>#3094AB</mn><mo>≡</mo><mi>rgb</mi><mfenced open="(" close=")"><mn>48</mn><mn>148</mn><mn>171</mn></mfenced></math>');
    test("`rgb`(48, 148, 171) == #`#3094AB`",
         '<math><mi>rgb</mi><mfenced open="(" close=")"><mn>48</mn><mn>148</mn><mn>171</mn></mfenced><mo>≡</mo><mn>#3094AB</mn></math>');
  });

  it("Forty two", function() {
    test("#`0x2A` = #`XLII` = #`4.2e+01` = #`forty two` = 42",
         "<math><mn>0x2A</mn><mo>=</mo><mn>XLII</mn><mo>=</mo><mn>4.2e+01</mn><mo>=</mo><mn>forty two</mn><mo>=</mo><mn>42</mn></math>");
  });
});


describe('Operators', function() {
  it('Should force operators with \\', function() {
    test('\\^', '<math><mo>^</mo></math>');
    test('\\\\', '<math><mo>\\</mo></math>');
  });

  it('Should force long operator with \\(op) and \\[op]', function() {
    test('\\(int)', '<math><mo>int</mo></math>');
    test('\\[(] \\([)', '<math><mo>(</mo><mo>[</mo></math>');
    test('\\((1))', "<math><mo>(1)</mo></math>");
  });

  it("Should only force an operator when \\ precedes a character", function() {
    test("\\", "<math><mi>\\</mi></math>");
  });

  it('i hat', function() {
    test('ı.^\\^', '<math><mover><mi>ı</mi><mo>^</mo></mover></math>');
  });

  it('The operator (n) as an overscript', function() {
    test('x.^\\[(n)]', '<math><mover><mi>x</mi><mo>(n)</mo></mover></math>');
  });

  it('Sums', function() {
    test('sum_(n=0)^k a_n = a_0 + a_i + cdots + a_k', '<math><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mi>k</mi></munderover><msub><mi>a</mi><mi>n</mi></msub><mo>=</mo><msub><mi>a</mi><mn>0</mn></msub><mo>+</mo><msub><mi>a</mi><mi>i</mi></msub><mo>+</mo><mo>⋯</mo><mo>+</mo><msub><mi>a</mi><mi>k</mi></msub></math>');
  });

  it('Function composition', function() {
    test('bf`F` @ bf`G`  :  U sube RR^3 -> RR^2', '<math><mi mathvariant="bold">F</mi><mo>∘</mo><mi mathvariant="bold">G</mi><mspace width="1ex" /><mo>:</mo><mspace width="1ex" /><mi>U</mi><mo>⊆</mo><msup><mi mathvariant="normal">ℝ</mi><mn>3</mn></msup><mo>→</mo><msup><mi mathvariant="normal">ℝ</mi><mn>2</mn></msup></math>');
  });

  it('Eulers number', function() {
    test("e = sum_(n=0)^oo 1 / n!", '<math><mi>e</mi><mo>=</mo><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mi mathvariant="normal">∞</mi></munderover><mfrac><mn>1</mn><mrow><mi>n</mi><mo>!</mo></mrow></mfrac></math>');
  });

  it('Should remove space around derivatives', function() {
    test("f'(x)", '<math><mi>f</mi><mo lspace="0" rspace="0">′</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>');
    test("f''(x)", '<math><mi>f</mi><mo lspace="0" rspace="0">″</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>');
    test("f'''(x)", '<math><mi>f</mi><mo lspace="0" rspace="0">‴</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>');
    test("f''''(x)", '<math><mi>f</mi><mo lspace="0" rspace="0">⁗</mo><mfenced open="(" close=")"><mi>x</mi></mfenced></math>');
  });

  it('Bayes theorem', function() {
    test('p(a | b) = (p(b | a)p(a)) / p(b)', '<math><mi>p</mi><mfenced open="(" close=")"><mrow><mi>a</mi><mo stretchy="true" lspace="veryverythickmathspace" rspace="veryverythickmathspace">|</mo><mi>b</mi></mrow></mfenced><mo>=</mo><mfrac><mrow><mi>p</mi><mfenced open="(" close=")"><mrow><mi>b</mi><mo stretchy="true" lspace="veryverythickmathspace" rspace="veryverythickmathspace">|</mo><mi>a</mi></mrow></mfenced><mi>p</mi><mfenced open="(" close=")"><mi>a</mi></mfenced></mrow><mrow><mi>p</mi><mfenced open="(" close=")"><mi>b</mi></mfenced></mrow></mfrac></math>');
  });

  it('Gradient', function() {
    test("grad f(x,y) = ((del f)/(del x) (x, y), (del f)/(del y) (x,y))",
        '<math><mo rspace="0">∇</mo><mi>f</mi><mfenced open="(" close=")"><mi>x</mi><mi>y</mi></mfenced><mo>=</mo><mfenced open="(" close=")"><mrow><mfrac><mrow><mo rspace="0">∂</mo><mi>f</mi></mrow><mrow><mo rspace="0">∂</mo><mi>x</mi></mrow></mfrac><mfenced open="(" close=")"><mi>x</mi><mi>y</mi></mfenced></mrow><mrow><mfrac><mrow><mo rspace="0">∂</mo><mi>f</mi></mrow><mrow><mo rspace="0">∂</mo><mi>y</mi></mrow></mfrac><mfenced open="(" close=")"><mi>x</mi><mi>y</mi></mfenced></mrow></mfenced></math>');
  });

  it('Taylor polynomial', function() {
    test("P_k(x) = f(a) + f'(a)(x-a) + (f''(a))/2! (x-a)^2 + cdots + (f^((k))(a))/k! (x-a)^k",
         '<math><msub><mi>P</mi><mi>k</mi></msub><mfenced open="(" close=")"><mi>x</mi></mfenced><mo>=</mo><mi>f</mi><mfenced open="(" close=")"><mi>a</mi></mfenced><mo>+</mo><mi>f</mi><mo lspace="0" rspace="0">′</mo><mfenced open="(" close=")"><mi>a</mi></mfenced><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>a</mi></mrow></mfenced><mo>+</mo><mfrac><mrow><mi>f</mi><mo lspace="0" rspace="0">″</mo><mfenced open="(" close=")"><mi>a</mi></mfenced></mrow><mrow><mn>2</mn><mo>!</mo></mrow></mfrac><msup><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>a</mi></mrow></mfenced><mn>2</mn></msup><mo>+</mo><mo>⋯</mo><mo>+</mo><mfrac><mrow><msup><mi>f</mi><mfenced open="(" close=")"><mi>k</mi></mfenced></msup><mfenced open="(" close=")"><mi>a</mi></mfenced></mrow><mrow><mi>k</mi><mo>!</mo></mrow></mfrac><msup><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>a</mi></mrow></mfenced><mi>k</mi></msup></math>');
  });

  it('Strokes theorem', function() {
    test("oint_(del S) bf`F` * dbf`s` = dint_S grad xx bf`F` * dbf`s`",
         '<math><msub><mo>∮</mo><mrow><mo rspace="0">∂</mo><mi>S</mi></mrow></msub><mi mathvariant="bold">F</mi><mo>·</mo><mi>d</mi><mi mathvariant="bold">s</mi><mo>=</mo><msub><mo>∬</mo><mi>S</mi></msub><mo rspace="0">∇</mo><mo>×</mo><mi mathvariant="bold">F</mi><mo>·</mo><mi>d</mi><mi mathvariant="bold">s</mi></math>');
  });
});


describe('Whitespace', function() {
  it('Should keep whitespace if more then one space', function() {
    test("a  b", '<math><mi>a</mi><mspace width="1ex" /><mi>b</mi></math>');
    test("a b", "<math><mi>a</mi><mi>b</mi></math>");
  });

  it('But not if one or less', function() {
    expect(ascii2mathml("a b")).to.be(ascii2mathml("ab"));
    expect(ascii2mathml("a  b")).not.to.be(ascii2mathml("ab"));
  });

  it('Should have width following the equation `n-1`ex', function() {
    for (var n=2; n < 20; n++) {
      test("a" + new Array(n+1).join(' ') + "b",
           '<math><mi>a</mi><mspace width="' + (n-1) + 'ex" /><mi>b</mi></math>');
    }
  });

  it('Should group adjacent symbols on either side of whitespace in an <mrow>', function() {
    test('ab cd', "<math><mrow><mi>a</mi><mi>b</mi></mrow><mi>c</mi><mi>d</mi></math>");
  });

  it("But not straight after a function", function() {
    test("sin (a + b)", '<math><mi>sin</mi><mfenced open="(" close=")"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mfenced></math>');
  });

  it("An <mspace> should not cause trouble in fences", function() {
    expect(ascii2mathml).withArgs("(a     ]")
      .not.to.throwException();
    expect(ascii2mathml).withArgs("(a     ,   b    ,     ]")
      .not.to.throwException();
    expect(ascii2mathml).withArgs("(a     ,   b    ,     c]")
      .not.to.throwException();
  });
});


describe("Identifier", function() {
  it("Greeks (uppercase in normal variant, lowercase in italic)", function() {
    test("Gamma Delta Theta Lambda Xi Pi Sigma Phi Psi Omega",
         '<math><mi mathvariant="normal">Γ</mi><mi mathvariant="normal">Δ</mi><mi mathvariant="normal">Θ</mi><mi mathvariant="normal">Λ</mi><mi mathvariant="normal">Ξ</mi><mi mathvariant="normal">Π</mi><mi mathvariant="normal">Σ</mi><mi mathvariant="normal">Φ</mi><mi mathvariant="normal">Ψ</mi><mi mathvariant="normal">Ω</mi></math>');
    test("alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi pi rho sigma tau upsilon phi chi psi omega",
         "<math><mi>α</mi><mi>β</mi><mi>γ</mi><mi>δ</mi><mi>ɛ</mi><mi>ζ</mi><mi>η</mi><mi>θ</mi><mi>ι</mi><mi>κ</mi><mi>λ</mi><mi>μ</mi><mi>ν</mi><mi>ξ</mi><mi>π</mi><mi>ρ</mi><mi>σ</mi><mi>τ</mi><mi>υ</mi><mi>φ</mi><mi>χ</mi><mi>ψ</mi><mi>ω</mi></math>");
  });
  it('Special', function() {
    test("oo O/", '<math><mi mathvariant="normal">∞</mi><mi mathvariant="normal">∅</mi></math>');
  });
  it('Blackboard', function() {
    test("NN ZZ QQ RR CC", '<math><mi mathvariant="normal">ℕ</mi><mi mathvariant="normal">ℤ</mi><mi mathvariant="normal">ℚ</mi><mi mathvariant="normal">ℝ</mi><mi mathvariant="normal">ℂ</mi></math>');
  });
  it('Should force identifiers with (`)', function() {
    test("`int`", "<math><mi>int</mi></math>");
  });
});


describe('Standard functions', function() {
  it("Should have all standard functions", function() {
    test("sin", "<math><mi>sin</mi></math>");
    test("cos", "<math><mi>cos</mi></math>");
    test("tan", "<math><mi>tan</mi></math>");
    test("csc", "<math><mi>csc</mi></math>");
    test("sec", "<math><mi>sec</mi></math>");
    test("cot", "<math><mi>cot</mi></math>");
    test("sinh", "<math><mi>sinh</mi></math>");
    test("cosh", "<math><mi>cosh</mi></math>");
    test("tanh", "<math><mi>tanh</mi></math>");
    test("log", "<math><mi>log</mi></math>");
    test("ln", "<math><mi>ln</mi></math>");
    test("det", "<math><mi>det</mi></math>");
    test("dim", "<math><mi>dim</mi></math>");
    test("lim", "<math><mi>lim</mi></math>");
    test("mod", "<math><mi>mod</mi></math>");
    test("gcd", "<math><mi>gcd</mi></math>");
    test("lcm", "<math><mi>lcm</mi></math>");
    test("min", "<math><mi>min</mi></math>");
    test("max", "<math><mi>max</mi></math>");
  });

  it("Tangent = Sinus over Cosinus", function() {
      test("tan = sin/cos",
           "<math><mrow><mi>tan</mi><mo>=</mo></mrow><mfrac><mi>sin</mi><mi>cos</mi></mfrac></math>");
  });
  it("The hyperbolic functions", function() {
    test("sinh x = (e^x - e^(-x))/2, cosh x = (e^x + e^(-x))/2, tanh x = (sinh x)/(cosh x)",
         '<math><mrow><mi>sinh</mi><mi>x</mi></mrow><mo>=</mo><mfrac><mrow><msup><mi>e</mi><mi>x</mi></msup><mo>-</mo><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></mrow><mn>2</mn></mfrac><mo>,</mo><mrow><mi>cosh</mi><mi>x</mi></mrow><mo>=</mo><mfrac><mrow><msup><mi>e</mi><mi>x</mi></msup><mo>+</mo><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></mrow><mn>2</mn></mfrac><mo>,</mo><mrow><mi>tanh</mi><mi>x</mi></mrow><mo>=</mo><mfrac><mrow><mi>sinh</mi><mi>x</mi></mrow><mrow><mi>cosh</mi><mi>x</mi></mrow></mfrac></math>');
  });
  it("Logarithm change of base", function() {
    test("log_b x = (log_k x)/(log_k b)", "<math><msub><mi>log</mi><mi>b</mi></msub><mi>x</mi><mo>=</mo><mfrac><mrow><msub><mi>log</mi><mi>k</mi></msub><mi>x</mi></mrow><mrow><msub><mi>log</mi><mi>k</mi></msub><mi>b</mi></mrow></mfrac></math>");
  });
  it("Logarithm powers", function() {
    test("ln x^2 = 2 ln x", "<math><mrow><mi>ln</mi><msup><mi>x</mi><mn>2</mn></msup></mrow><mo>=</mo><mn>2</mn><mrow><mi>ln</mi><mi>x</mi></mrow></math>");
  });
  it("Logarithm division", function() {
    test("ln(x/y) = ln x - ln y",
         '<math><mi>ln</mi><mfenced open="(" close=")"><mfrac><mi>x</mi><mi>y</mi></mfrac></mfenced><mo>=</mo><mrow><mi>ln</mi><mi>x</mi></mrow><mo>-</mo><mrow><mi>ln</mi><mi>y</mi></mrow></math>');
  });
  it("2×2 determinants", function() {
    test("det(A) = |(a, b), (c, d)| = ad - cd", '<math><mi>det</mi><mfenced open="(" close=")"><mi>A</mi></mfenced><mo>=</mo><mfenced open="|" close="|"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable></mfenced><mo>=</mo><mrow><mi>a</mi><mi>d</mi></mrow><mo>-</mo><mi>c</mi><mi>d</mi></math>');
  });
  it("Fermats little theorem", function() {
    test("a^(p-1) -= 1   (mod p)",
         '<math><msup><mi>a</mi><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow></msup><mo>≡</mo><mn>1</mn><mspace width="2ex" /><mfenced open="(" close=")"><mrow><mi>mod</mi><mi>p</mi></mrow></mfenced></math>');
  });
});


describe('Fractions', function() {
  it("Should display fractions", function() {
    test("a/b", "<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>");
  });

  it('Should have bevelled fractions', function() {
    test("a./b", '<math><mfrac bevelled="true"><mi>a</mi><mi>b</mi></mfrac></math>');
  });

  it('Should not parse `//` as fraction', function() {
    test('a//b', '<math><mi>a</mi><mo>/</mo><mi>b</mi></math>');
  });

  it("Should not display brackets around numerator or denominator", function() {
    test("(a+b)/(c+d)", "<math><mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mrow><mi>c</mi><mo>+</mo><mi>d</mi></mrow></mfrac></math>");
  });

  it("Should not fail on trailing fractions", function() {
    test("a/", "<math><mfrac><mi>a</mi><mrow></mrow></mfrac></math>");
    test("b ./ ", '<math><mfrac bevelled="true"><mi>b</mi><mrow></mrow></mfrac></math>');
  });

  it('Should have whitespace delimited fractions', function() {
    test("1+3 / 2+2", "<math><mfrac><mrow><mn>1</mn><mo>+</mo><mn>3</mn></mrow><mrow><mn>2</mn><mo>+</mo><mn>2</mn></mrow></mfrac></math>");
    test("1 + 3/2 + 2", "<math><mn>1</mn><mo>+</mo><mfrac><mn>3</mn><mn>2</mn></mfrac><mo>+</mo><mn>2</mn></math>");
     test("a./b / c./d", '<math><mfrac><mfrac bevelled="true"><mi>a</mi><mi>b</mi></mfrac><mfrac bevelled="true"><mi>c</mi><mi>d</mi></mfrac></mfrac></math>');
  });

  it("Golden ratio (continued fraction)", function() {
    test("phi = 1 + 1/(1 + 1/(1 + 1/(1 + 1/(1 + ddots))))",
         "<math><mi>φ</mi><mo>=</mo><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mo>⋱</mo></mrow></mfrac></mrow></mfrac></mrow></mfrac></mrow></mfrac></math>");
  });

  it("Normal distribution", function() {
    test('cc`N`(x | mu, sigma^2) = 1/(sqrt(2pi sigma^2)) e^(-((x-mu)^2) / 2sigma^2)',
         '<math><mi mathvariant="script">N</mi><mfenced open="(" close=")"><mrow><mi>x</mi><mo stretchy="true" lspace="veryverythickmathspace" rspace="veryverythickmathspace">|</mo><mi>μ</mi></mrow><msup><mi>σ</mi><mn>2</mn></msup></mfenced><mo>=</mo><mfrac><mn>1</mn><msqrt><mrow><mn>2</mn><mi>π</mi><msup><mi>σ</mi><mn>2</mn></msup></mrow></msqrt></mfrac><msup><mi>e</mi><mrow><mo>-</mo><mfrac><msup><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>μ</mi></mrow></mfenced><mn>2</mn></msup><mrow><mn>2</mn><msup><mi>σ</mi><mn>2</mn></msup></mrow></mfrac></mrow></msup></math>');
  });
});


describe('Roots', function() {
  it("Should display square roots", function() {
    test("sqrt x", "<math><msqrt><mi>x</mi></msqrt></math>");
  });

  it("Should display n-roots", function() {
    test("root n x", "<math><mroot><mi>x</mi><mi>n</mi></mroot></math>");
  });

  it("Should not display brackets in roots", function() {
    test("sqrt(2)", "<math><msqrt><mn>2</mn></msqrt></math>");
    test("root(3)(2)", "<math><mroot><mn>2</mn><mn>3</mn></mroot></math>");
  });

  it("Should not fail in empty roots", function() {
    test("sqrt", "<math><msqrt><mrow></mrow></msqrt></math>");
    test("root  ", "<math><mroot><mrow></mrow><mrow></mrow></mroot></math>");
    test("root 3 ", "<math><mroot><mrow></mrow><mn>3</mn></mroot></math>");
  });

  it("sqrt(2) ≈ 1.414", function() {
    test("sqrt 2 ~~ 1.414213562", "<math><msqrt><mn>2</mn></msqrt><mo>≈</mo><mn>1.414213562</mn></math>");
  });

  it("Quadradic formula", function() {
    test("x = (-b +- sqrt(b^2 - 4ac)) / 2a",
         "<math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>±</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math>");
  });

  it("Golden ratio (algebraic form)", function() {
    test("phi = (1 + sqrt 5)/2", "<math><mi>φ</mi><mo>=</mo><mfrac><mrow><mn>1</mn><mo>+</mo><msqrt><mn>5</mn></msqrt></mrow><mn>2</mn></mfrac></math>");
  });

  it("Plastic number", function() {
    test("rho = (root3(108 + 12 sqrt 69) + root3(108 - 12 sqrt 69)) / 6",
         "<math><mi>ρ</mi><mo>=</mo><mfrac><mrow><mroot><mrow><mn>108</mn><mo>+</mo><mn>12</mn><msqrt><mn>69</mn></msqrt></mrow><mn>3</mn></mroot><mo>+</mo><mroot><mrow><mn>108</mn><mo>-</mo><mn>12</mn><msqrt><mn>69</mn></msqrt></mrow><mn>3</mn></mroot></mrow><mn>6</mn></mfrac></math>");
  });

  it("Continued square root", function() {
    test("sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + cdots)))))))",
         "<math><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><msqrt><mrow><mn>1</mn><mo>+</mo><mo>⋯</mo></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></mrow></msqrt></math>");
  });
});


describe('Groupings', function() {
  it('Should group brackets together', function() {
    test('(a+b)', '<math><mfenced open="(" close=")"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mfenced></math>');
  });

  it('Should handle comma seperated lists', function() {
    test('a,b,c', '<math><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi></math>');
  });

  it('Should add parentesis around parentesized comma seperated lists', function() {
    test('(a,b,c)', '<math><mfenced open="(" close=")"><mi>a</mi><mi>b</mi><mi>c</mi></mfenced></math>');
  });

  it("Should not fail on unclosed fences", function() {
    test("(a", '<math><mfenced open="(" close=""><mi>a</mi></mfenced></math>');
    test("((a)", '<math><mfenced open="(" close=""><mfenced open="(" close=")"><mi>a</mi></mfenced></mfenced></math>');
    test("[(", '<math><mfenced open="[" close=""><mfenced open="(" close=""></mfenced></mfenced></math>');
  });

  it('Simplify polynomials', function() {
    test("(x+y)(x-y) = x^2-y^2", '<math><mfenced open="(" close=")"><mrow><mi>x</mi><mo>+</mo><mi>y</mi></mrow></mfenced><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>y</mi></mrow></mfenced><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>-</mo><msup><mi>y</mi><mn>2</mn></msup></math>');
  });

  it('Exponential decay', function() {
    test("e^(-x)", "<math><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></math>");
  });

  it('Eulers identity', function() {
    test("e^(i tau) = 1", "<math><msup><mi>e</mi><mrow><mi>i</mi><mi>τ</mi></mrow></msup><mo>=</mo><mn>1</mn></math>");
  });

  it("The natural numbers", function() {
    test('NN = {1, 2, 3, ...}', '<math><mi mathvariant="normal">ℕ</mi><mo>=</mo><mfenced open="{" close="}"><mn>1</mn><mn>2</mn><mn>3</mn><mo>…</mo></mfenced></math>');
  });

  it("Average over time", function() {
    test('(: V(t)^2 :) = lim_(T->oo) 1/T int_(-T./2)^(T./2) V(t)^2 dt',
         '<math><mfenced open="⟨" close="⟩"><mrow><mi>V</mi><msup><mfenced open="(" close=")"><mi>t</mi></mfenced><mn>2</mn></msup></mrow></mfenced><mo>=</mo><munder><mi>lim</mi><mrow><mi>T</mi><mo>→</mo><mi mathvariant="normal">∞</mi></mrow></munder><mfrac><mn>1</mn><mi>T</mi></mfrac><msubsup><mo>∫</mo><mrow><mo>-</mo><mfrac bevelled="true"><mi>T</mi><mn>2</mn></mfrac></mrow><mfrac bevelled="true"><mi>T</mi><mn>2</mn></mfrac></msubsup><mi>V</mi><msup><mfenced open="(" close=")"><mi>t</mi></mfenced><mn>2</mn></msup><mi>d</mi><mi>t</mi></math>');
  });

  it('Complex groupings', function() {
    test('abs(x)', '<math><mfenced open="|" close="|"><mi>x</mi></mfenced></math>');
    test('floor(x)', '<math><mfenced open="⌊" close="⌋"><mi>x</mi></mfenced></math>');
    test('ceil(x)', '<math><mfenced open="⌈" close="⌉"><mi>x</mi></mfenced></math>');
    test('norm(x)', '<math><mfenced open="∥" close="∥"><mi>x</mi></mfenced></math>');

    test('abs x', '<math><mfenced open="|" close="|"><mi>x</mi></mfenced></math>');
    test('floor x', '<math><mfenced open="⌊" close="⌋"><mi>x</mi></mfenced></math>');
    test('ceil x', '<math><mfenced open="⌈" close="⌉"><mi>x</mi></mfenced></math>');
    test('norm x', '<math><mfenced open="∥" close="∥"><mi>x</mi></mfenced></math>');
  });
});


describe('Super and subscripts', function() {
  it('Should display subscripts', function() {
    test("a_i", "<math><msub><mi>a</mi><mi>i</mi></msub></math>");
  });

  it('Should display superscripts', function() {
    test("a^2", "<math><msup><mi>a</mi><mn>2</mn></msup></math>");
  });

  it('Should display sub-superscripts', function() {
    test("a_i^2", "<math><msubsup><mi>a</mi><mi>i</mi><mn>2</mn></msubsup></math>");
  });

  it('Should render sub-superscripts in either direction', function() {
    test("a^2_i", "<math><msubsup><mi>a</mi><mi>i</mi><mn>2</mn></msubsup></math>");
  });

  it("Should not throw on trailing sub or superscripts", function() {
    test("a^", "<math><msup><mi>a</mi><mrow></mrow></msup></math>");
    test("b_  ", "<math><msub><mi>b</mi><mrow></mrow></msub></math>");
  });

  it("Should not throw on trailing under or overscripts", function() {
    test("a.^", "<math><mover><mi>a</mi><mrow></mrow></mover></math>");
    test("b._  ", "<math><munder><mi>b</mi><mrow></mrow></munder></math>");
  });

  it("Should not throw on trailing sub-supscript", function() {
    test("a_i^", "<math><msubsup><mi>a</mi><mi>i</mi><mrow></mrow></msubsup></math>");
    test("a^2_", "<math><msubsup><mi>a</mi><mrow></mrow><mn>2</mn></msubsup></math>");
  });

  it("Should not throw on trailing under-overscript", function() {
    expect(ascii2mathml).withArgs("a._i .^").not.to.throwException();
    expect(ascii2mathml).withArgs("a._i  ^").not.to.throwException();
    expect(ascii2mathml).withArgs("a.^2._ ").not.to.throwException();
    expect(ascii2mathml).withArgs("a.^ 2_ ").not.to.throwException();
  });

  it('Should not treat `^^` as superscript', function() {
    test('a^^2', '<math><mi>a</mi><mo>∧</mo><mn>2</mn></math>');
  });

  it('Should not treat `__` or `_|` as subscript', function() {
    test('a_|_i', '<math><mi>a</mi><mo>⊥</mo><mi>i</mi></math>');
    test('|__a__|i', '<math><mo>⌊</mo><mi>a</mi><mo>⌋</mo><mi>i</mi></math>');
  });

  it('Pythagorean theorem', function() {
    test("a^2 + b^2 = c^2", "<math><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup><mo>=</mo><msup><mi>c</mi><mn>2</mn></msup></math>");
  });

  it('Matrix transpose', function() {
    test("(X^T)_(ij) = X_(ji)",
         '<math><msub><mfenced open="(" close=")"><msup><mi>X</mi><mi>T</mi></msup></mfenced><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><msub><mi>X</mi><mrow><mi>j</mi><mi>i</mi></mrow></msub></math>');
  });

  it('The natural logarithm', function() {
    test("ln x = int_1^x 1/t dt", "<math><mrow><mi>ln</mi><mi>x</mi></mrow><mo>=</mo><msubsup><mo>∫</mo><mn>1</mn><mi>x</mi></msubsup><mfrac><mn>1</mn><mi>t</mi></mfrac><mi>d</mi><mi>t</mi></math>");
  });

  it('Powers of powers of two', function() {
    test("2^2^2^2", "<math><msup><mn>2</mn><msup><mn>2</mn><msup><mn>2</mn><mn>2</mn></msup></msup></msup></math>");
  });
});

describe('Under and overscripts', function() {
  it('Should display underscripts', function() {
    test('X._a', "<math><munder><mi>X</mi><mi>a</mi></munder></math>");
  });
  it('Should display overscripts', function() {
    test('X.^a', "<math><mover><mi>X</mi><mi>a</mi></mover></math>");
  });
  it('Should display overscripts', function() {
    test('X.^a._b', "<math><munderover><mi>X</mi><mi>b</mi><mi>a</mi></munderover></math>");
  });
  it('Should go under limits', function() {
    test('lim_(a -> b)', "<math><munder><mi>lim</mi><mrow><mi>a</mi><mo>→</mo><mi>b</mi></mrow></munder></math>");
    test('lim_(a->b)', "<math><munder><mi>lim</mi><mrow><mi>a</mi><mo>→</mo><mi>b</mi></mrow></munder></math>");
  });
  it('Should go over and under sums', function() {
    test('sum_(i=0)^n', "<math><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>0</mn></mrow><mi>n</mi></munderover></math>");
    test('sum^n_(i=0)', "<math><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>0</mn></mrow><mi>n</mi></munderover></math>");
  });
  it("Should go over and under products", function() {
    test('prod_(i=1)^n', "<math><munderover><mo>∏</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover></math>");
    test('prod^n_(i=1)', "<math><munderover><mo>∏</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover></math>");
  });

  it("Golden ratio (defenition)", function() {
    test('phi =.^"def" a/b = (a+b)/a', "<math><mi>φ</mi><mover><mo>=</mo><mtext>def</mtext></mover><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>=</mo><mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mi>a</mi></mfrac></math>");
  });
  it("Matrix dimentions", function() {
    test('X._(n xx m)', "<math><munder><mi>X</mi><mrow><mi>n</mi><mo>×</mo><mi>m</mi></mrow></munder></math>");
  });
  it("k times x", function() {
    test('{: x + ... + x :}.^⏞.^(k  "times")', '<math><mover><mfenced open="" close=""><mrow><mi>x</mi><mo>+</mo><mo>…</mo><mo>+</mo><mi>x</mi></mrow></mfenced><mover><mo>⏞</mo><mrow><mi>k</mi><mspace width="1ex" /><mtext>times</mtext></mrow></mover></mover></math>');
  });
});


describe('Matrices', function() {
  it('Should display column vectors', function() {
    test("(1;2;3)", '<math><mfenced open="(" close=")"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></math>');
  });

  it('Should display matrices', function() {
    test('[[a, b], [c, d]]', '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable></mfenced></math>');
  });

  it('Should display matrices with semicolon as a column separator', function() {
    expect(ascii2mathml('[[a; b]; [c; d]]', {decimalMark: ','}))
      .to.be(ascii2mathml('[[a, b], [c, d]]'));
  });

  it('Should accept newlines instead of commas', function() {
    expect(ascii2mathml('[[a, b]\n [c, d]]'))
      .to.be(ascii2mathml('[[a, b], [c, d]]'));
    expect(ascii2mathml('[[a, b],\n [c, d]]'))
      .to.be(ascii2mathml('[[a, b], [c, d]]'));
  });

  it('Should accept newlines instead of semicolons (w. `;` as colSep)', function() {
    expect(ascii2mathml('[[a; b]\n [c; d]]', {colSep: ';'}))
      .to.be(ascii2mathml('[[a, b], [c, d]]'));
    expect(ascii2mathml('[[a; b];\n [c; d]]', {colSep: ';'}))
      .to.be(ascii2mathml('[[a, b], [c, d]]'));
  });

  it('Should display matrices using comma, semicolon syntax', function() {
    test('[1, 2, 3; 4, 5, 6]', '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd></mtr></mtable></mfenced></math>');
  });

  it('Should allow trailing row brakes', function() {
    test('[1, 2, 3;]', '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></math>');
    test('[(1, 2, 3),]', '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></math>');
  });

  it('Should allow newlines as row separators', function() {
    expect(ascii2mathml('[1, 2, 3\n 4, 5, 6]'))
      .to.be(ascii2mathml('[1, 2, 3; 4, 5, 6]'));
    expect(ascii2mathml('[a\n b\n c]'))
      .to.be(ascii2mathml('[a; b; c]'));
    expect(ascii2mathml('(4\n 6)'))
      .to.be(ascii2mathml('(4; 6)'));
  });

  it('Should display vertical bar delimited matrices', function() {
    test('|(a,b,c), (d,e,f), (h,i,j)|', '<math><mfenced open="|" close="|"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd><mtd><mi>c</mi></mtd></mtr><mtr><mtd><mi>d</mi></mtd><mtd><mi>e</mi></mtd><mtd><mi>f</mi></mtd></mtr><mtr><mtd><mi>h</mi></mtd><mtd><mi>i</mi></mtd><mtd><mi>j</mi></mtd></mtr></mtable></mfenced></math>');
  });

  it('Should display double vertical bar delimited matrices', function() {
    test('|| a ; b ; c ||', '<math><mfenced open="‖" close="‖"><mtable><mtr><mtd><mi>a</mi></mtd></mtr><mtr><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd></mtr></mtable></mfenced></math>');
  });

  it('The general n×m matrix', function() {
    test('A = [[a_(1 1), a_(1 2), cdots, a_(1 n)], [a_(2 1), a_(2 2), cdots, a_(2 n)], [vdots, vdots, ddots, vdots], [a_(m 1), a_(m 2), cdots, a_(m n)]]',
         '<math><mi>A</mi><mo>=</mo><mfenced open="[" close="]"><mtable><mtr><mtd><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mn>2</mn></mrow></msub></mtd><mtd><mo>⋯</mo></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>2</mn><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mn>2</mn></mrow></msub></mtd><mtd><mo>⋯</mo></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mi>n</mi></mrow></msub></mtd></mtr><mtr><mtd><mo>⋮</mo></mtd><mtd><mo>⋮</mo></mtd><mtd><mo>⋱</mo></mtd><mtd><mo>⋮</mo></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mi>m</mi><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mi>m</mi><mn>2</mn></mrow></msub></mtd><mtd><mo>⋯</mo></mtd><mtd><msub><mi>a</mi><mrow><mi>m</mi><mi>n</mi></mrow></msub></mtd></mtr></mtable></mfenced></math>');
  });
  it('Nested matrices', function() {
    test("[[((a, b), (d, e)), -1], [1, ((f, g), (h, i))]]",
         '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mfenced open="(" close=")"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>d</mi></mtd><mtd><mi>e</mi></mtd></mtr></mtable></mfenced></mtd><mtd><mo>-</mo><mn>1</mn></mtd></mtr><mtr><mtd><mn>1</mn></mtd><mtd><mfenced open="(" close=")"><mtable><mtr><mtd><mi>f</mi></mtd><mtd><mi>g</mi></mtd></mtr><mtr><mtd><mi>h</mi></mtd><mtd><mi>i</mi></mtd></mtr></mtable></mfenced></mtd></mtr></mtable></mfenced></math>');
  });
  it('The binomial coefficient', function() {
    test("(n; k) = n! / (n-k)!k!",
         '<math><mfenced open="(" close=")"><mfrac linethickness="0"><mi>n</mi><mi>k</mi></mfrac></mfenced><mo>=</mo><mfrac><mrow><mi>n</mi><mo>!</mo></mrow><mrow><mfenced open="(" close=")"><mrow><mi>n</mi><mo>-</mo><mi>k</mi></mrow></mfenced><mo>!</mo><mi>k</mi><mo>!</mo></mrow></mfrac></math>');
  });
  it("The absolute value", function() {
    test('|x| = { (x\\,, if x >= 0), (-x\\,, if x < 0) :}',
         '<math><mfenced open="|" close="|"><mi>x</mi></mfenced><mo>=</mo><mfenced open="{" close=""><mtable columnalign="center left"><mtr><mtd><mi>x</mi><mo>,</mo></mtd><mtd><mo>if</mo><mi>x</mi><mo>≥</mo><mn>0</mn></mtd></mtr><mtr><mtd><mo>-</mo><mi>x</mi><mo>,</mo></mtd><mtd><mo>if</mo><mi>x</mi><mo>&lt;</mo><mn>0</mn></mtd></mtr></mtable></mfenced></math>');
  });
  it('Factorial', function() {
    test('n! = { [1,  if n=0 or n=1],  [n(n-1)!,  if n > 1] :}',
         '<math><mrow><mi>n</mi><mo>!</mo></mrow><mo>=</mo><mfenced open="{" close=""><mtable columnalign="center left"><mtr><mtd><mn>1</mn></mtd><mtd><mo>if</mo><mi>n</mi><mo>=</mo><mn>0</mn><mo>or</mo><mi>n</mi><mo>=</mo><mn>1</mn></mtd></mtr><mtr><mtd><mi>n</mi><mfenced open="(" close=")"><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow></mfenced><mo>!</mo></mtd><mtd><mo>if</mo><mi>n</mi><mo>&gt;</mo><mn>1</mn></mtd></mtr></mtable></mfenced></math>');
  });
});

describe('Fonts', function() {
  it("Should display double quoted as text", function() {
    test('"alpha"', "<math><mtext>alpha</mtext></math>");
  });
  it("Should display backtick surrounded as identifiers", function() {
    test('`Gamma` != Gamma',
         '<math><mi>Gamma</mi><mo>≠</mo><mi mathvariant="normal">Γ</mi></math>');
    test('`1`', "<math><mi>1</mi></math>");
  });
  it("Should set mathvariants for texts", function() {
    test('rm"abc"', '<math><mtext mathvariant="normal">abc</mtext></math>');
    test('it"abc"', '<math><mtext mathvariant="italic">abc</mtext></math>');
    test('bf"abc"', '<math><mtext mathvariant="bold">abc</mtext></math>');
    test('bb"abc"', '<math><mtext mathvariant="double-struck">abc</mtext></math>');
    test('cc"abc"', '<math><mtext mathvariant="script">abc</mtext></math>');
    test('fr"abc"', '<math><mtext mathvariant="fraktur">abc</mtext></math>');
    test('sf"abc"', '<math><mtext mathvariant="sans-serif">abc</mtext></math>');
    test('tt"abc"', '<math><mtext mathvariant="monospace">abc</mtext></math>');
  });
  it("Should set mathvariants for identifiers", function() {
    test("rm`abc`", '<math><mi mathvariant="normal">abc</mi></math>');
    test("it`abc`", '<math><mi mathvariant="italic">abc</mi></math>');
    test("bf`abc`", '<math><mi mathvariant="bold">abc</mi></math>');
    test("bb`abc`", '<math><mi mathvariant="double-struck">abc</mi></math>');
    test("cc`abc`", '<math><mi mathvariant="script">abc</mi></math>');
    test("fr`abc`", '<math><mi mathvariant="fraktur">abc</mi></math>');
    test("sf`abc`", '<math><mi mathvariant="sans-serif">abc</mi></math>');
    test("tt`abc`", '<math><mi mathvariant="monospace">abc</mi></math>');
  });
});


describe('Accents', function() {
  it('Should display accents', function() {
    test('hat x', '<math><mover><mi>x</mi><mo accent="true">^</mo></mover></math>');
    test('bar x', '<math><mover><mi>x</mi><mo accent="true">‾</mo></mover></math>');
    test('ul x', '<math><munder><mi>x</mi><mo>_</mo></munder></math>');
    test('vec x', '<math><mover><mi>x</mi><mo accent="true">→</mo></mover></math>');
    test('dot x', '<math><mover><mi>x</mi><mo accent="true">⋅</mo></mover></math>');
    test('ddot x', '<math><mover><mi>x</mi><mo accent="true">⋅⋅</mo></mover></math>');
    test('tilde x', '<math><mover><mi>x</mi><mo accent="true">˜</mo></mover></math>');
  });
  it('Should display dottless i and dottless j under overscript accents', function() {
    test('bar i', '<math><mover><mi>ı</mi><mo accent="true">‾</mo></mover></math>');
    test('vec j', '<math><mover><mi>ȷ</mi><mo accent="true">→</mo></mover></math>');
    test('ul i', '<math><munder><mi>i</mi><mo>_</mo></munder></math>');
  });
  it('Should put accents over all the following parenthesis', function() {
    test("3hat(xyz)", '<math><mn>3</mn><mover><mrow><mi>x</mi><mi>y</mi><mi>z</mi></mrow><mo accent="true">^</mo></mover></math>');
  });
  it('Physics vector notation', function() {
    test('vec x = ahat i + bhat j + chat k',
         '<math><mover><mi>x</mi><mo accent="true">→</mo></mover><mo>=</mo><mrow><mi>a</mi><mover><mi>ı</mi><mo accent="true">^</mo></mover></mrow><mo>+</mo><mrow><mi>b</mi><mover><mi>ȷ</mi><mo accent="true">^</mo></mover></mrow><mo>+</mo><mrow><mi>c</mi><mover><mi>k</mi><mo accent="true">^</mo></mover></mrow></math>');
  });
});
