# Snapshot report for `test/groupings.js`

The actual snapshot is saved in `groupings.js.snap`.

Generated by [AVA](https://avajs.dev).

## Groups brackets together

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mo fence="true">)</mo></mrow></math>'

## Handles comma seperated lists

> Snapshot 1

    '<math><mrow><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi></mrow></math>'

## Adds parentesis around parentesized comma seperated lists

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mrow><mi>a</mi><mo separator="true">,</mo><mi>b</mi><mo separator="true">,</mo><mi>c</mi></mrow><mo fence="true">)</mo></mrow></math>'

## Allows unclosed fences

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mi>a</mi></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">(</mo><mrow><mo fence="true">(</mo><mi>a</mi><mo fence="true">)</mo></mrow></mrow></math>'

> Snapshot 3

    '<math><mrow><mo fence="true">[</mo><mrow><mo fence="true">(</mo><mrow></mrow></mrow></mrow></math>'

## Complex groupings

> Snapshot 1

    '<math><mrow><mo fence="true">|</mo><mi>x</mi><mo fence="true">|</mo></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">⌊</mo><mi>x</mi><mo fence="true">⌋</mo></mrow></math>'

> Snapshot 3

    '<math><mrow><mo fence="true">⌈</mo><mi>x</mi><mo fence="true">⌉</mo></mrow></math>'

> Snapshot 4

    '<math><mrow><mo fence="true">‖</mo><mi>x</mi><mo fence="true">‖</mo></mrow></math>'

> Snapshot 5

    '<math><mrow><mo fence="true">|</mo><mi>x</mi><mo fence="true">|</mo></mrow></math>'

> Snapshot 6

    '<math><mrow><mo fence="true">⌊</mo><mi>x</mi><mo fence="true">⌋</mo></mrow></math>'

> Snapshot 7

    '<math><mrow><mo fence="true">⌈</mo><mi>x</mi><mo fence="true">⌉</mo></mrow></math>'

> Snapshot 8

    '<math><mrow><mo fence="true">‖</mo><mi>x</mi><mo fence="true">‖</mo></mrow></math>'

## Binom function

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mfrac linethickness="0"><mi>n</mi><mi>k</mi></mfrac><mo fence="true">)</mo></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">(</mo><mfrac linethickness="0"><mi>n</mi><mi>k</mi></mfrac><mo fence="true">)</mo></mrow></math>'

## Binom function accepts expressions

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mfrac linethickness="0"><mi>a</mi><mrow><mi>b</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo fence="true">)</mo></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">(</mo><mfrac linethickness="0"><mi>a</mi><mrow><mi>b</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo fence="true">)</mo></mrow></math>'

## Missing argument in the binom function

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mfrac linethickness="0"><mrow><mo fence="true">(</mo><mrow><mi>a</mi><mo separator="true">,</mo></mrow><mo fence="true">)</mo></mrow><mrow></mrow></mfrac><mo fence="true">)</mo></mrow></math>'

> Snapshot 2

    '<math><mrow><mo fence="true">(</mo><mfrac linethickness="0"><mrow></mrow><mi>b</mi></mfrac><mo fence="true">)</mo></mrow></math>'

## Simplify polynomials

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mrow><mi>x</mi><mo>+</mo><mi>y</mi></mrow><mo fence="true">)</mo></mrow><mrow><mo fence="true">(</mo><mrow><mi>x</mi><mo>−</mo><mi>y</mi></mrow><mo fence="true">)</mo></mrow><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><msup><mi>y</mi><mn>2</mn></msup></math>'

## Exponential decay

> Snapshot 1

    '<math><msup><mi>e</mi><mrow><mo>−</mo><mi>x</mi></mrow></msup></math>'

## Eulers identity

> Snapshot 1

    '<math><msup><mi>e</mi><mrow><mi>i</mi><mi>τ</mi></mrow></msup><mo>=</mo><mn>1</mn></math>'

## The natural numbers

> Snapshot 1

    '<math><mi>ℕ</mi><mo>=</mo><mrow><mo fence="true">{</mo><mrow><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo separator="true">,</mo><mo>…</mo></mrow><mo fence="true">}</mo></mrow></math>'

## Average over time

> Snapshot 1

    '<math><mrow><mo fence="true">⟨</mo><mrow><mi>V</mi><msup><mrow><mo fence="true">(</mo><mi>t</mi><mo fence="true">)</mo></mrow><mn>2</mn></msup></mrow><mo fence="true">⟩</mo></mrow><mo>=</mo><munder><mo>lim</mo><mrow><mi>T</mi><mo>→</mo><mi>∞</mi></mrow></munder><mfrac><mn>1</mn><mi>T</mi></mfrac><msubsup><mo>∫</mo><mrow><mo>−</mo><mfrac><mi>T</mi><mn>2</mn></mfrac></mrow><mfrac><mi>T</mi><mn>2</mn></mfrac></msubsup><mrow><mi>V</mi><msup><mrow><mo fence="true">(</mo><mi>t</mi><mo fence="true">)</mo></mrow><mn>2</mn></msup></mrow><mrow><mo rspace="0">𝑑</mo><mi>t</mi></mrow></math>'

## Partial differential evaluation

> Snapshot 1

    '<math><mi>F</mi><mo>=</mo><msub><mrow><mfrac><mrow><mo lspace="0">∂</mo><mi>f</mi></mrow><mrow><mo lspace="0">∂</mo><mi>x</mi></mrow></mfrac><mo lspace="0.35ex" fence="true">|</mo></mrow><msub><mover accent="true"><mi>x</mi><mo>^</mo></mover><mrow><mi>k</mi><mo>−</mo><mn>1</mn></mrow></msub></msub></math>'

## The binomial coefficient

> Snapshot 1

    '<math><mrow><mo fence="true">(</mo><mfrac linethickness="0"><mi>n</mi><mi>k</mi></mfrac><mo fence="true">)</mo></mrow><mo>=</mo><mfrac><mrow><mi>n</mi><mo>!</mo></mrow><mrow><mi>n</mi><mo>−</mo><mi>k</mi></mrow></mfrac><mrow><mo>!</mo><mi>k</mi><mo>!</mo></mrow></math>'

## Quantom state vector

> Snapshot 1

    '<math><mrow><mo fence="true">|</mo><mrow><mi mathvariant="normal">Ψ</mi><mrow><mo fence="true">(</mo><mi>t</mi><mo fence="true">)</mo></mrow></mrow><mo fence="true">⟩</mo></mrow><mo>=</mo><mo>∫</mo><mrow><mi mathvariant="normal">Ψ</mi><mrow><mo fence="true">(</mo><mrow><mi>x</mi><mo separator="true">,</mo><mi>t</mi></mrow><mo fence="true">)</mo></mrow></mrow><mrow><mo fence="true">|</mo><mi>x</mi><mo fence="true">⟩</mo></mrow><mrow><mo rspace="0">𝑑</mo><mi>x</mi></mrow></math>'
