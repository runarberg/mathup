Ascii2MathML
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
choose what to do with the output as well (piping it to another
program, calling your favorite DOM parser to inject it, or just
logging it to the console).


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
document (or users of your app) are using a
[standard conforming browser](http://caniuse.com/#feat=mathml), they
will benefit a great bit. You will be able to translate your
expression on the server before your readers even open the document,
reducing any lag time to native.


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


Syntax
------

MathML has four token elements (identifiers `<mi>`, operators `<mo>`,
numbers `<mn>` and text `<mtext>`). Ascii2MathML recognizes which of
these you mean when you write simple expressions, (for example: `1+1 =
2` ⇒ `<mn>1</mn><mo>+</mo><mn>1</mn><mo>=</mo><mn>2</mn>`; `sin theta`
⇒ `<mi>sin</mi><mi>θ</mi>`). Ascii2MathML will also recognize most of
the unicode characters you’ll write. If a character comes from one of
the mathematical operator code blocks it will wrap it in an `<mo>`
tag, otherwise it will be wrapped in an `<mi>` tag.

### Operators ###

The first character after a backslash (`\`) will become an opperator,
if you need more then one character in the operator (sucn as for
`and`), you can parenthesis it in normal (`\(operator)`) or squared
(`\[operator]`) brackets. In addition, the following will
automatically be interpreted as operators.

#### Operational ####

|:-----:|:-:|
| `+`   | + |
| `-`   | − |
| `*`   | ⋅ |
| `**`  | ∗ |
| `+-`  | ± |
| `***` | ⋆ |
| `//`  | / |
| `\\`  | \\|
| `xx`  | × |
| `-:`  | ÷ |
| `@`   | ∘ |
| `o+`  | ⊕ |
| `ox`  | ⊗ |
| `o.`  | ⊙ |
| `sum` | ∑ |
| `prod`| ∏ |
| `int` | ∫ |
| `dint`| ∬ |
| `oint`| ∮ |
| `^^`  | ∧ |
| `^^^` | ⋀ |
| `vv`  | ∨ |
| `vvv` | ⋁ |
| `nn`  | ∩ |
| `nnn` | ⋂ |
| `uu`  | ∪ |
| `uuu` | ⋃ |

#### Miscellaneous ####

|:---------:|:-:|
| `del`     | ∂ |
| `grad`    | ∇ |
| `aleph`   | ℵ |
| `/_`      | ∠ |
| `diamond` | ⋄ |
| `square`  | □ |
| `|__`     | ⌊ |
| `__|`     | ⌋ |
| `|~`      | ⌈ |
| `~|`      | ⌉ |

#### Relational ####

|:-----:|:-:|
| `=`   | = |
| `!=`  | ≠ |
| `<`   | < |
| `>`   | > |
| `<=`  | ≤ |
| `>=`  | ≥ |
| `-<`  | ≺ |
| `>-`  | ≻ |
| `in`  | ∈ |
| `!in` | ∉ |
| `sub` | ⊂ |
| `sup` | ⊃ |
| `sube`| ⊆ |
| `supe`| ⊇ |
| `-=`  | ≡ |
| `~=`  | ≅ |
| `~~`  | ≈ |
| `prop`| ∝ |

#### Logical ####

|:-----:|:---:|
| `and` | and |
| `or`  | or  | 
| `not` | ¬   |
| `if`  | if  |
| `AA`  | ∀   |
| `EE`  | ∃   |
| `_|_` | ⊥   |
| `TT`  | ⊤   |
| `|--` | ⊢   |
| `|==` | ⊨   |

#### Arrows ####

|:------:|:-:|
| `uarr` | ↑ |
| `darr` | ↓ |
| `rarr` | → |
| `->`   | → |
| `|->`  | ↦ |
| `larr` | ← |
| `<-`   | ← |
| `harr` | ↔ |
| `<->`  | ↔ |
| `rArr` | ⇒ |
| `=>`   | ⇒ |
| `lArr` | ⇐ |
| `hArr` | ⇔ |
| `<=>`  | ⇔ |

#### Punctuations ####

|:-------:|:-:|
| `:.`    | ∴ |
| `...`   | … |
| `cdots` | ⋯ |
| `ddots` | ⋱ |
| `vdots` | ⋮ |

### Identifiers ###

Identifiers are any non-space separated characters in between
backticks (`` ` ``). You can alter the font variant of the identifier
by prefixing with a font command (`` rm`identifier` ``). The following
are supplied as stanard identifiers so you *don’t* need to surround
them with backticks:

* sin
* cos
* tan
* csc
* sec
* cot
* sinh
* cosh
* tanh
* log
* ln
* det
* dim
* lim
* mod
* gcd
* lcm
* min
* max

In addition any greek character name will compile to it’s
corresponding character (`alpha` ⇒ α; `Gamma` ⇒ Γ). Only greek capital
letters that don’t look like their corresponding latin capital letter
will convert. In addition, Greek capitals will convert with normal
(roman) font variant however.

The following additional identifiers are also provided through commands

|:----:|:-:|
| `oo` | ∞ |
| `O/` | ∅ |
| `CC` | ℂ |
| `NN` | ℕ |
| `QQ` | ℚ |
| `RR` | ℝ |
| `ZZ` | ℤ |


### Spaces ###

MathML has an element called `<mspace>`. Two or more spaces in a row
will be translated into that element where it makes sense. The width
of the element will be 1 − *n*ex, where *n* is the number of spaces.


### Fractions ###

In MathML you enclose fractions in an `<mfrac>` element. In
Ascii2MathML you simply separate the numerator *a* and the denominator
*b* with a slash (`a/b`). Ascii2MathML tries to be smart about what
you mean as numerator and denominator by looking at the spaces you
surround you subexpressions with, so `a+b / c+d` is *not* the same
thing as `a + b/c + d`. In later versions I hope to extend this
syntax. You can have your fractions
[bevelled](https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mfrac#attr-bevelled)
by adding a dot in front of the slash (`a./b`).


### Sub and superscripts ###

The underscore will impose the following expression as a subscript on
the preceding expression (`a_i` ⇒ aᵢ), the ascii caret will impose a
superscript (`a^2` ⇒ a²), and the (expression, underscore, caret) /
(experssion, caret, underscore) sequence (`a_i^2`/`a^2_i`) will impose
a sub and superscript on the first expression.

Over and underscripts follow a similar pattern exept with `._` for
underscripts and `.^` for overscripts. Also `lim_x` will put *x* as an
underscript, and `sum_a^b` and `prod_a^b` will put *a* and *b* as
under and overscripts.


### Roots ###

MathML has `<msqrt>` and `<mroot>` tags for roots. Ascii2MathML
similarly provides `sqrt x` and `root n x` for the squared root of *x*
and the *n*-th root of *x* respectively.


### Groupings ###

MathML uses fences to group numers and identifiers
together. Ascii2MathML opens a fence with open parentesis (even
unicode ones) and closes it with a close parentesis. Note that
parentesis don’t have to match, but they do have to come in open/close
pairs. If you need an open parentesis to close a group, you are forced
to represent them as operators like so `{x ∈ X : a < x < b} = \]a,
b\([)`. Open parenthesis are any of `(`, `[`, `{`, `⟦`, `⟨`, `⟪`, `⟬`,
`⟮`, `⦃`, `⦅`, `⦇`, `⦉`, `⦋`, `⦍`, `⦏`, `⦑`, `⦓`, `⦕`, `⦗` and closing
are any of `)`, `]`, `}`, `⟧`, `⟩`, `⟫`, `⟭`, `⟯`, `⦄`, `⦆`, `⦈`, `⦊`,
`⦌`, `⦎`, `⦐`, `⦒`, `⦔`, `⦖`, `⦘`. In addition `(:` will compile to
"⟨", `:)` to "⟩", and `{:` and `:}` will open or close a group without
displaying the fences.


### Matrices ###

Matrices are comma seperated groups inside a group. For example `A =
[[1,2,3], [4,5,6]]` is a 2×3 matrix and `[[1,4], [2,5], [3,6]]` is *A*
transposed. You can quickly write a column vector with
`[1; 2; 3]`. All this does is put the outer brackets as a fence around
the table inside, so if you want case assignmet you can write:

    |x| = { (x,  if x >= 0), (-x,  otherwise) :}

As a bonus this will also left align the condition column for you.


### Accents ###

The following accent will add what follows as an accent over the
following expression:

|:-----:|:-:|
| `hat` | ^ |
| `bar` | ‾ |
| `vec` | → |
| `dot` | ⋅ |
| `ddot`| ⋅⋅|

In addition, `ul a` will add _ as an underscript to *a*.


### Font commands ###

Forced identifiers and texts takes a preceding font comman as a
parameter. That means you can write bf`` `v` `` if you want to
bold-face an identifier or `it"text"` if you want some text
italicized. The following commands have the following font variant:

|:----:|:--------------:|
| `rm` | normal         |
| `bf` | bold           |
| `it` | italic         |
| `bb` | double-struck  |
| `cc` | script         |
| `fr` | fraktur        |
| `sf` | sans-serif     |
| `tt` | monospace      |
