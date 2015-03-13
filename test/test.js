"use strict";

var ascii2mathml = require("../index.js");
var expect = require("expect.js");

var test = function(ascii, mathml) {
  return expect(ascii2mathml(ascii)).to.be(mathml);
};


describe('Options', function() {
  it('Should display block, when passed in', function() {
    expect(ascii2mathml("", {display: "block"}))
      .to.be('<math display="block"></math>');
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

describe('Operators', function() {
  it('Eulers number', function() {
    test("e = sum_(n=0)^oo 1 / n!", '<math><mi>e</mi><mo>=</mo><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mi mathvariant="normal">∞</mi></munderover><mfrac><mn>1</mn><mrow><mi>n</mi><mo>!</mo></mrow></mfrac></math>');
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
    for (let n=2; n < 20; n++) {
      test(`a${new Array(n+1).join(' ')}b`,
           `<math><mi>a</mi><mspace width="${n-1}ex" /><mi>b</mi></math>`);
    }
  });
  it('Should group adjacent symbols on either side of whitespace in an <mrow>', function() {
    test('ab cd', "<math><mrow><mi>a</mi><mi>b</mi></mrow><mi>c</mi><mi>d</mi></math>");
  });
});


describe("Identifier", function() {
  it("Greeks (uppercase in normal variant, lowercase in italic)", function() {
    test("Gamma Delta Theta Lambda Xi Pi Sigma Phi Psi Omega",
         '<math><mi mathvariant="normal">Γ</mi><mi mathvariant="normal">Δ</mi><mi mathvariant="normal">Θ</mi><mi mathvariant="normal">Λ</mi><mi mathvariant="normal">Ξ</mi><mi mathvariant="normal">Π</mi><mi mathvariant="normal">Σ</mi><mi mathvariant="normal">Φ</mi><mi mathvariant="normal">Ψ</mi><mi mathvariant="normal">Ω</mi></math>');
    test("alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi pi rho sigma tau upsilon phi chi psi omega",
         "<math><mi>α</mi><mi>β</mi><mi>γ</mi><mi>δ</mi><mi>ε</mi><mi>ζ</mi><mi>η</mi><mi>θ</mi><mi>ι</mi><mi>κ</mi><mi>λ</mi><mi>μ</mi><mi>ν</mi><mi>ξ</mi><mi>π</mi><mi>ρ</mi><mi>σ</mi><mi>τ</mi><mi>υ</mi><mi>ϕ</mi><mi>χ</mi><mi>ψ</mi><mi>ω</mi></math>");
    test("varepsilon varphi vartheta", "<math><mi>ɛ</mi><mi>φ</mi><mi>ϑ</mi></math>");
  });
  it('Special', function() {
    test("grad oo O/", '<math><mi mathvariant="normal">∇</mi><mi mathvariant="normal">∞</mi><mi mathvariant="normal">∅</mi></math>');
  });
  it('Other', function() {
    test("aleph del", '<math><mi mathvariant="normal">ℵ</mi><mi mathvariant="normal">∂</mi></math>');
  });
  it('Blackboard', function() {
    test("NN ZZ QQ RR CC", '<math><mi mathvariant="normal">ℕ</mi><mi mathvariant="normal">ℤ</mi><mi mathvariant="normal">ℚ</mi><mi mathvariant="normal">ℝ</mi><mi mathvariant="normal">ℂ</mi></math>');
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
    test("tan = sin/cos", "<math><mi>tan</mi><mo>=</mo><mfrac><mi>sin</mi><mi>cos</mi></mfrac></math>");
  });
  it("The hyperbolic functions", function() {
    test("sinh x = (e^x - e^(-x))/2, cosh x = (e^x + e^(-x))/2, tanh x = (sinh x)/(cosh x)",
         '<math><mi>sinh</mi><mi>x</mi><mo>=</mo><mfrac><mrow><msup><mi>e</mi><mi>x</mi></msup><mo>-</mo><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></mrow><mn>2</mn></mfrac><mo>,</mo><mi>cosh</mi><mi>x</mi><mo>=</mo><mfrac><mrow><msup><mi>e</mi><mi>x</mi></msup><mo>+</mo><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></mrow><mn>2</mn></mfrac><mo>,</mo><mi>tanh</mi><mi>x</mi><mo>=</mo><mfrac><mrow><mi>sinh</mi><mi>x</mi></mrow><mrow><mi>cosh</mi><mi>x</mi></mrow></mfrac></math>');
  });
  it("Logarithm change of base", function() {
    test("log_b x = (log_k x)/(log_k b)", "<math><msub><mi>log</mi><mi>b</mi></msub><mi>x</mi><mo>=</mo><mfrac><mrow><msub><mi>log</mi><mi>k</mi></msub><mi>x</mi></mrow><mrow><msub><mi>log</mi><mi>k</mi></msub><mi>b</mi></mrow></mfrac></math>");
  });
  it("Logarithm powers", function() {
    test("ln x^2 = 2 ln x", "<math><mi>ln</mi><msup><mi>x</mi><mn>2</mn></msup><mo>=</mo><mn>2</mn><mi>ln</mi><mi>x</mi></math>");
  });
  it("Logarithm division", function() {
    test("ln(x/y) = ln x - ln y",
         '<math><mi>ln</mi><mfenced open="(" close=")"><mfrac><mi>x</mi><mi>y</mi></mfrac></mfenced><mo>=</mo><mi>ln</mi><mi>x</mi><mo>-</mo><mi>ln</mi><mi>y</mi></math>');
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
  it('Should have bevilled fractions', function() {
    test("a./b", '<math><mfrac bevelled="true"><mi>a</mi><mi>b</mi></mfrac></math>');
  });
  it("Should not display brackets around numerator or denominator", function() {
    test("(a+b)/(c+d)", "<math><mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mrow><mi>c</mi><mo>+</mo><mi>d</mi></mrow></mfrac></math>");
  });
  it('Should have whitespace delimited fractions', function() {
    test("1+3 / 2+2", "<math><mfrac><mrow><mn>1</mn><mo>+</mo><mn>3</mn></mrow><mrow><mn>2</mn><mo>+</mo><mn>2</mn></mrow></mfrac></math>");
    test("1 + 3/2 + 2", "<math><mn>1</mn><mo>+</mo><mfrac><mn>3</mn><mn>2</mn></mfrac><mo>+</mo><mn>2</mn></math>");
    test("a./b / c./d", '<math><mfrac><mfrac bevelled="true"><mi>a</mi><mi>b</mi></mfrac><mfrac bevelled="true"><mi>c</mi><mi>d</mi></mfrac></mfrac></math>');
  });

  it("Golden ratio (continued fraction)", function() {
    test("varphi = 1 + 1/(1 + 1/(1 + 1/(1 + 1/(1 + ddots))))",
         "<math><mi>φ</mi><mo>=</mo><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mo>⋱</mo></mrow></mfrac></mrow></mfrac></mrow></mfrac></mrow></mfrac></math>");
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

  it("sqrt(2) ≈ 1.414", function() {
    test("sqrt 2 ~~ 1.414213562", "<math><msqrt><mn>2</mn></msqrt><mo>≈</mo><mn>1.414213562</mn></math>");
  });
  it("Quadradic formula", function() {
    test("x = (-b +- sqrt(b^2 - 4ac)) / 2a",
         "<math><mi>x</mi><mo>=</mo><mfrac><mrow><mrow><mo>-</mo><mi>b</mi></mrow><mo>±</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math>");
  });
  it("Golden ratio (algebraic form)", function() {
    test("varphi = (1 + sqrt 5)/2", "<math><mi>φ</mi><mo>=</mo><mfrac><mrow><mn>1</mn><mo>+</mo><msqrt><mn>5</mn></msqrt></mrow><mn>2</mn></mfrac></math>");
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

  it('Simplify polynomials', function() {
    test("(x+y)(x-y) = x^2-y^2", '<math><mfenced open="(" close=")"><mrow><mi>x</mi><mo>+</mo><mi>y</mi></mrow></mfenced><mfenced open="(" close=")"><mrow><mi>x</mi><mo>-</mo><mi>y</mi></mrow></mfenced><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>-</mo><msup><mi>y</mi><mn>2</mn></msup></math>');
  });
  it('Exponential decay', function() {
    test("e^(-x)", "<math><msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup></math>");
  });
  it('Eulers identity', function() {
    test("e^(i tau) = 1", "<math><msup><mi>e</mi><mrow><mi>i</mi><mi>τ</mi></mrow></msup><mo>=</mo><mn>1</mn></math>");
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

  it('Pythagorean theorem', function() {
    test("a^2 + b^2 = c^2", "<math><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup><mo>=</mo><msup><mi>c</mi><mn>2</mn></msup></math>");
  });
  it('Matrix transpose', function() {
    test("(X^T)_(ij) = X_(ji)",
         '<math><msub><mfenced open="(" close=")"><msup><mi>X</mi><mi>T</mi></msup></mfenced><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><msub><mi>X</mi><mrow><mi>j</mi><mi>i</mi></mrow></msub></math>');
  });
  it('The natural logarithm', function() {
    test("ln x = int_1^x 1/t dt", "<math><mi>ln</mi><mi>x</mi><mo>=</mo><msubsup><mo>∫</mo><mn>1</mn><mi>x</mi></msubsup><mfrac><mn>1</mn><mi>t</mi></mfrac><mi>d</mi><mi>t</mi></math>");
  });
  it('Powers of powers of two', function() {
    test("2^2^2^2", "<math><msup><msup><msup><mn>2</mn><mn>2</mn></msup><mn>2</mn></msup><mn>2</mn></msup></math>");
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
    test('varphi =.^"def" a/b = (a+b)/a', "<math><mi>φ</mi><mover><mo>=</mo><mtext>def</mtext></mover><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>=</mo><mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mi>a</mi></mfrac></math>");
  });
  it("Matrix dimentions", function() {
    test('X._(n xx m)', "<math><munder><mi>X</mi><mrow><mi>n</mi><mo>×</mo><mi>m</mi></mrow></munder></math>");
  });
});


describe('Matrices', function() {
  it('Should display column vectors', function() {
    test("(1;2;3)", '<math><mfenced open="(" close=")"><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></math>');
  });
  it('Should display matrices', function() {
    test('[[a, b], [c, d]]', '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable></mfenced></math>');
  });
  it('Should display vertical bar delimited matrices', function() {
    test('|(a,b,c), (d,e,f), (h,i,j)|', '<math><mfenced open="|" close="|"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd><mtd><mi>c</mi></mtd></mtr><mtr><mtd><mi>d</mi></mtd><mtd><mi>e</mi></mtd><mtd><mi>f</mi></mtd></mtr><mtr><mtd><mi>h</mi></mtd><mtd><mi>i</mi></mtd><mtd><mi>j</mi></mtd></mtr></mtable></mfenced></math>');
  });
  it('should display double vertical bar delimited matrices', function() {
    test('|| a ; b ; c ||', '<math><mfenced open="‖" close="‖"><mtable><mtr><mtd><mi>a</mi></mtd></mtr><mtr><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd></mtr></mtable></mfenced></math>');
  });

  it('Nested matrices', function() {
    test("[[((a, b), (d, e)), -1], [1, ((f, g), (h, i))]]",
         '<math><mfenced open="[" close="]"><mtable><mtr><mtd><mfenced open="(" close=")"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>d</mi></mtd><mtd><mi>e</mi></mtd></mtr></mtable></mfenced></mtd><mtd><mo>-</mo><mn>1</mn></mtd></mtr><mtr><mtd><mn>1</mn></mtd><mtd><mfenced open="(" close=")"><mtable><mtr><mtd><mi>f</mi></mtd><mtd><mi>g</mi></mtd></mtr><mtr><mtd><mi>h</mi></mtd><mtd><mi>i</mi></mtd></mtr></mtable></mfenced></mtd></mtr></mtable></mfenced></math>');
  });
  it('Combination', function() {
    test("(n; k) = n! / (n-k)!k!",
         '<math><mfenced open="(" close=")"><mfrac linethickness="0"><mi>n</mi><mi>k</mi></mfrac></mfenced><mo>=</mo><mfrac><mrow><mi>n</mi><mo>!</mo></mrow><mrow><mfenced open="(" close=")"><mrow><mi>n</mi><mo>-</mo><mi>k</mi></mrow></mfenced><mo>!</mo><mi>k</mi><mo>!</mo></mrow></mfrac></math>');
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
    test('hat x', '<math><mover><mi>x</mi><mo>^</mo></mover></math>');
    test('bar x', '<math><mover><mi>x</mi><mo>‾</mo></mover></math>');
    test('ul x', '<math><munder><mi>x</mi><mo>_</mo></munder></math>');
    test('vec x', '<math><mover><mi>x</mi><mo>→</mo></mover></math>');
    test('dot x', '<math><mover><mi>x</mi><mo>⋅</mo></mover></math>');
    test('ddot x', '<math><mover><mi>x</mi><mo>⋅⋅</mo></mover></math>');
  });
  it('Should display dottless i and dottless j under overscript accents', function() {
    test('bar i', '<math><mover><mi>ı</mi><mo>‾</mo></mover></math>');
    test('vec j', '<math><mover><mi>ȷ</mi><mo>→</mo></mover></math>');
    test('ul i', '<math><munder><mi>i</mi><mo>_</mo></munder></math>');
  });
  it('Should put accents over all the following parenthesis', function() {
    test("3hat(xyz)", '<math><mn>3</mn><mover><mrow><mi>x</mi><mi>y</mi><mi>z</mi></mrow><mo>^</mo></mover></math>');
  });
  it('Physics vetor notation', function() {
    //test('vec x = ahat i + bhat j + chat k');
  });
});
