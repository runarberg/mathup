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
