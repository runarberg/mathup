ascii2MathML
============

The second AsciiMath – MathML converter
---------------------------------------

This package exposes a single function `ascii2mathml` that intuitively
takes simple mathematical expressions written in an
[*AsciiMath*](http://asciimath.org/) dialog, and outputs verbose and
ugly (but structured) [*MathML*](http://www.w3.org/Math/), that is all
it does.

You can use it on the command line or on the server as a
[node](http://nodejs.org/)/[io.js](https://iojs.org/) package, or in
the browser by including the script source. In the browser, you choose
how to parse the math in your document (by looking hard for any math-y
substrings, parsing all expressions wrapped in `$`…`$`, or using some
other excellent tools out there that does it for you). And you can
choose what to do with output as well (piping it to another program,
calling your favorite DOM parser to inject it, or just logging it to
the console).


Why not just use *MathJax*?
---------------------------

[*MathJax*](http://www.mathjax.org/) is an excellent tool that you
should probably be using if all you want to do is include complex
mathematical expressions in a document. And you should probably use it
*along side* this package as well if you want
[Chrome users](http://www.chromestatus.com/features/5240822173794304)
to be able to read your expressions. However, MathJax is a complex
piece of software that does a great deal more than just translate
simple expression into structured form, and if that is all you want to
do, then MathJax is definitely overkill. Ascii2MathML promises to be a
lot faster (by doing less) then MathJax, and if the readers of your
document (or users of your app) are using a standard conforming
browser, they will benefit a great bit. You will be able to translate
your expression on the server before your readers even open the
document, reducing lag time to zero.


Why AsciiMath / Why not TeΧ?
----------------------------

I wrote this tool, because I wanted to be able to author mathematical
expressions quickly, with no overhead (imagine `1/2` instead of
`\frac{1}{2}`). TeΧ expressions can easily become verbose and annoying
to write (especially on keyboards with complex access to the `\`, `{`,
and `}` keys). However, the purpose of this package is *not* to give
people complete control over MathML in a non-verbose way, the purpose
is to make it simple for people to write simple expression. Of course
I’ll try to give as much expressive power as possible in the way, but
I won’t promise to make all complex things possible.

If you want full support of MathML, and don't want to write all those
tags perhaps you should look for another tool. There are other great
efforts to enable people to author MathML in TeX format, take a look
at [TeXZilla](https://github.com/fred-wang/TeXZilla) for example.


Differences to the original AsciiMath
-------------------------------------

As stated I will try to make this tool as expressive as possible while
not giving way for simplicity. That means a slight deviation from the
original AsciiMath implementation. These changes include:


|----------------------:|---------------------------------------|
| Smart unicode support | `⊕` ⇒ `<mo>⊕</mo>`, `α` ⇒ `<mi>α</mi>`|
| Forcing operators by surrounding them in backticks | `` `Gamma`(theta)`` ⇒ <math><mo>Gamma</mo><mrow><mo>(</mo><mi>θ</mi><mo>)</mo></mrow></math>, `Gamma(theta)` ⇒ <math><mi>Γ</mi><mrow><mo>(</mo><mi>θ</mi><mo>)</mo></mrow></math> |
| Over and underscripts | `=.^"def"` ⇒ <math><mrow><mover><mo>=</mo><mtext>def</mtext></mover></mrow></math>, `X._(n xx m)` ⇒ <math><mrow><munder><mi>X</mi><mrow><mi>n</mi><mo>×</mo><mi>m</mi></mrow></munder></mrow></math> |
| White space awareness | `a   b` ⇒ `<mi>a</mi><mspace width="1em" /><mi>b</mi>` |
