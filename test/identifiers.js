import test from "ava";
import a2ml from "../src/index.js";

test("Greeks (uppercase in normal variant, lowercase in italic)", t => {
  t.is(
    a2ml("Gamma Delta Theta Lambda Xi Pi Sigma Phi Psi Omega"),
    '<math><mi mathvariant="normal">Γ</mi><mi mathvariant="normal">Δ</mi><mi mathvariant="normal">Θ</mi><mi mathvariant="normal">Λ</mi><mi mathvariant="normal">Ξ</mi><mi mathvariant="normal">Π</mi><mi mathvariant="normal">Σ</mi><mi mathvariant="normal">Φ</mi><mi mathvariant="normal">Ψ</mi><mi mathvariant="normal">Ω</mi></math>',
  );

  t.is(
    a2ml(
      "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi pi rho sigma tau upsilon phi chi psi omega",
    ),
    "<math><mi>α</mi><mi>β</mi><mi>γ</mi><mi>δ</mi><mi>ɛ</mi><mi>ζ</mi><mi>η</mi><mi>θ</mi><mi>ι</mi><mi>κ</mi><mi>λ</mi><mi>μ</mi><mi>ν</mi><mi>ξ</mi><mi>π</mi><mi>ρ</mi><mi>σ</mi><mi>τ</mi><mi>υ</mi><mi>φ</mi><mi>χ</mi><mi>ψ</mi><mi>ω</mi></math>",
  );
});

test("Special", t => {
  t.is(
    a2ml("oo O/"),
    '<math><mi mathvariant="normal">∞</mi><mi mathvariant="normal">∅</mi></math>',
  );
});

test("Blackboard", t => {
  t.is(
    a2ml("NN ZZ QQ RR CC"),
    '<math><mi mathvariant="normal">ℕ</mi><mi mathvariant="normal">ℤ</mi><mi mathvariant="normal">ℚ</mi><mi mathvariant="normal">ℝ</mi><mi mathvariant="normal">ℂ</mi></math>',
  );
});

test("Should force identifiers with (`)", t => {
  t.is(a2ml("`int`"), "<math><mi>int</mi></math>");
});
