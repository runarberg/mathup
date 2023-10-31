mathup v.next Release Notes
===========================

mathup v1.0.0-alpha.3 Release Notes
===================================

Language Changes
----------------

* The following floor and ceil operators are now considered fences.
  - `|__` ⇒ ⌊
  - `__|` ⇒ ⌋
  - `|~` ⇒ ⌈
  - `~|` ⇒ ⌉
* Added the following fences:
  - `<<` ⇒ ⟨
  - `>>` ⇒ ⟩


Output Changes
--------------

* `mathvariant="double-struck"` is deprecated. So now we do the text
  transforms directly on the output.


mathup v1.0.0-alpha.2 Release Notes
===================================

Language Changes
----------------

* Meaningful identifiers and operators cannot immedietly follow—or be
  followed by—an alphabetic character. E.g. `asinb` will not combine
  the `sin` into a single identifier. Surround the identifier with
  spaces to get the desired result. E.g. `a sin b`, or—better yet—use
  invisible (zero width) operators (U+2061–U+2064; `a&*sin&$b`; see
  below).
* **Infixes** (e.g. `/`, `^`, or `_`) now follow a consistent
  grammar. It will operate on the previous/next literal if it
  immediately presides/follows (e.g. no space between), otherwise it
  will operate on the previous/next expression (i.e. terms grouped
  together by surrounding space/parens/other infixes).
* Font commands now work on the following expression, as opposed to
  just following token elements. E.g. now its possible to do
  `bf [a; b]` to make all the terms of the matrix bold-face.
* **Bevelled fractions** (`a./b`) have been removed. They are
  deprecated in MathML and might be removed from browsers soon. Use
  `a//b` instead for a fraction slash operator.
* Removed **nested bracket matrix** notation: `[(a, b), (c, d)]`. Use
  column seperators or newlines for writing matrices: `[a, b; c, d]`.
* **pipe fences and matrices** (`|a,b;c,d|` and `||a,b;c,d||`) now
  require inner parenthesis (`|(a,b;c,d)|` and `||(a,b;c,d)||`
  respectively).
* **Unicode numbers** are now strictly (with one expection) in the Nd,
  Nl, and No unicode categories. The only exceptions are the dozenal
  `U+218A ↊ TURNED DIGIT TWO` and `U+218B ↋ TURNED DIGIT THREE`. This
  **omits CJK numerals** (like 二, 四, or 万) that were previously
  mapped to number literals. Prepend then with octothorpe (`#四十二`)
  if you want the old behavior.
* **Backslash operators** in brackets `\(foo)`, `\[bar]` have been
  removed. Instead they follow the same syntax as octothorpe numbers.
  Write `\int` for alphanumeric operators, or `` \`foo bar` `` if they
  contain symbols. If you need to use a backtick as an operator then
  the fencing follows the same syntax as markdown. ``` \`` ` `` ```.
  The same goes for octothorpe numbers `` #`forty two` ``, identifiers
  `` `foo bar` ``, and text ` "" "in quotes" "" `.
* **Roots** are now notated as taking two args (just like
  `binom`). write `root(a, b)` or `root a b`. Unlike previous versions
  `root(a)(b)` will now include the brackets around `a` and `b`.

Output Changes
--------------

* Fenced groups will no long render in the **deprecated `<mfenced>`
  element**. Instead it renders in the visually equivalent `<mrow>`s
  with `<mo>`s as fences and seperators.
* `lim` and `mod` now map to opperators and render in an `<mo>`
  element.


Additions
---------

* Added `.toString()` and `.toDOM()` methods to the returned object.
* Added `obrace` and `ubrace` to accents.
* Added invisible operators `&+`, `&*`, `&,`, and `&$` for implied
  addition, multiplication, seperation and function application
  respectively.

Breaking Changes
----------------

* Removed the following opitons from the main function—*they might be
  reimplented if demand is there*:
  - `annotate`
  - `bare`
  - `standalone`
* Calling main function with a single option parameter no longer
  returns another main function with those options applied. If you
  want to curry the main function, use an arrow function or a library:
  ```js
  const curried = input => mathup(input, { display: "block" })
  ```
* Main function no longer returns string by default. Use the
  `.toString()` method of the returned object instead.


Ascii2MathML v0.7.1 Release Notes
=================================

Fixes
-----

* `binom` function can now handle empty terms #32

Contributors
------------

* runarberg <runarberg@zoho.com>


Ascii2MathML v0.7.0 Release Notes
=================================

Additions
---------

* Added `binom(a, b)` for the binomial coefficient.

Braking Changes
---------------

* A two row column vector, denoted with `(a; b)` will no longer turn
  into a binomial coefficient. It will stay as a column vector. Use
  `binom(a, b)` if you want the old behavior.

Changes
-------

* Semicolon- and newline seperated matrices `[a, b; c, d]` now take
  precedence over parenthesis delimited matrices `[(a, b), (c, d)]` in
  case of ambiguity.

Contributors
------------

* runarberg <runarberg@zoho.com>


Ascii2MathML v0.6.2 Release Notes
=================================

Fixes
-----

* Fixed binary not working on native node. (#25)

Contributors
------------

* runarberg <runarberg@zoho.com>


Ascii2MathML v0.6.1 Release Notes
=================================

Fixes
-----

* Updated dependencies passing `npm audit`. (#24)

Changes
-------

* Comma/semicolon matrices to take precedence over bracket delimited
  matrices. (#19)

Contributors
------------

* runarberg <runarberg@zoho.com>
* shellyln <shellyln@users.noreply.github.com>


Ascii2MathML v0.6.0 Release Notes
=================================

Braking Changes
---------------

* Dropped support for io.js and node versions 0.10.x through 7.x. Now
  support is only from node version 8.x.
* Stopped transpiling down to ES5. This includes the distributed
  scripts and the npm published package. This means that if you want
  to support old browsers or runtimes you must transpile the scripts
  your self, using e.g. Babel.
* Dropped Babel as a runtime dependency. This means that if you are
  going to support old browsers or node environments you must provide
  your own polyfills for ES-2015+ methods.

Additions
---------

* Added new operators:
  - `|><` ⇒ ‘⋉’
  - `><|` ⇒ ‘⋊’
  - `|><|` ⇒ ‘⋈’
  - `-<=` ⇒ ‘⪯’
  - `>-=` ⇒ ‘⪰’
  - `~=` ⇒ ‘≅’
  - `>->` ⇒ ‘↣’
  - `->>` ⇒ ‘↠’
  - `>->>` ⇒ ‘⤖’
* Added complex groupings:
  - `abs(a + b)` ⇒ `|a + b|`
  - `floor(a + b)` ⇒ `⌊a + b⌋`
  - `ceil(a + b)` ⇒ `⌈a + b⌉`
  - `norm(a + b)` ⇒ `∥a + b∥`
* Added `tilde` (~) as a new accent.
* Added `cancel` as a new accent that diagonally strikes through the
  following expression.

Changes
-------

* Whitespace between font modifiers and expressions is now allowed.
  e.g. `it"foo"` and `it "foo"` are now equivalent.
* Expressions ending in Fraction, root, sqrt, sub, sup, under or
  overscript opperations without opperands, will opperate on the empty
  `<mrow>` instead of throwing an irrelevant expression. For example
  `sqrt` yields an empty squared root.
* Unclosed fences `(a, b,` will now longer throw exeptions, Instead
  the fence will be implicitly closed with the empty string.

Contributors
------------

* Lukas Bestle <mail@lukasbestle.com>
* runarberg <runarberg@zoho.com>


Ascii2MathML v0.5.0 Release Notes
=================================

New features
------------

* Passing in the `dir: "rtl"` option will add the attribute to the
  root math element, for right-to-left directionality.

Changes
-------

* The `==` operator now maps to ≡.


Ascii2MathML v0.4.0 Release Notes
=================================

New features
------------

* Allowing arbitrary numerals using the `` #`...` `` syntax.
* Ascii2MathML will now recognize most UNICODE numerals. The numeral
  codeblocks were borrowed from xregexps
  (unicode-plugin)[http://xregexp.com/plugins/#unicode], but extended
  to include the duodecimals and Chinese/Japanese numerals.

Changes
-------

* Supplying a minified version through the distributied code.


Ascii2MathML v0.3.0 Release Notes
=================================

New features
------------

* A trailing rowbrake in matrices are allowed. A trailing rowbrake in
  a fence will force a row-matrix.
* Newlines functions as rowbrakes for matrices.

Changes
-------

* Compiling the code to ECMA-5 with [Babeljs](https://babeljs.io/)
  pre-publish. That means it will run on node 0.10.x environments.


Ascii2MathML v0.2.0 Release Notes
=================================

New features
------------

* Added parsing options for decimal mark, column separators and row
  separators.
* Calling `ascii2mathml` with only an object will return another
  `ascii2mathml` function with the objects values as the new defaults.

Changes
-------

* Using [Babelify](https://babeljs.io/) transformation for
  [browserify](http://browserify.org/). That means greater browser
  support.
