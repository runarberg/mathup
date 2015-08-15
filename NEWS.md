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
