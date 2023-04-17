mathup
======

[![npm](https://img.shields.io/npm/v/mathup.svg)](https://www.npmjs.com/package/mathup)
[![License](https://img.shields.io/npm/l/mathup)](LICENSE)
[![Build Status](https://github.com/runarberg/mathup/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/runarberg/mathup/actions/workflows/ci.yml?query=branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/runarberg/mathup/badge.svg)](https://coveralls.io/github/runarberg/mathup)
[![Downloads](https://img.shields.io/npm/dm/mathup)](https://npm-stat.com/charts.html?package=mathup)  
[![npms Score](https://badges.npms.io/mathup.svg)](https://api.npms.io/v2/package/mathup)

#### Installation ####

##### npm #####

```bash
npm install mathup
```

```js
import mathup from "mathup";
```

##### Client #####

Download one of the [released assets](https://github.com/runarberg/mathup/releases)
and include the **module**:

```html
<script type="module" src="mathup.js"></script>
```

…the **custom element**:

```html
<script type="module" src="math-up-element.js"></script>
```

…or the **script**:

```html
<script src="mathup.iife.js"></script>
```

#### Usage ####

```js
const expression = "1+1 = 2";
const options = {};  // optional
const mathml = mathup(expression, options);

mathml.toString();
// => "<math><mrow><mn>1</mn><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>2</mn></math>"

const mathNode = mathml.toDOM();
// => [object MathMLElement]

// Update existing <math> node in place
mathup("3-2 = 1", { bare: true }).updateDOM(mathNode);
```


##### Custom Element #####

```html
<math-up
  display="inline"
  dir="ltr"
  decimal-mark=","
  col-sep=";"
  row-sep=";;"
>
  1+1 = 2
</math-up>
```

##### Command Line #####

```bash
npm install -g mathup

mathup [options] -- <expression>

# or from stdin
echo <expression> | mathup [options]
```

#### Options (with defaults) ####

```js
const options = {
  decimalMark: ".",   // -m,  --decimalmark="."
  colSep: ",",        // -c,  --colsep=","
  rowSep: ";",        // -r,  --rowsep=";"
  display: "inline",  // -d,  --display
  dir: "ltr",         //      --rtl
  bare: false,        // -b,  --bare
}
```

Reference
---------

[See here](http://runarberg.github.io/mathup/#reference)


Easy MathML authoring tool with a quick to write syntax
-------------------------------------------------------

This package exposes a single function `mathup` that intuitively takes
simple mathematical expressions—written in a markup language inspired
by [*AsciiMath*](http://asciimath.org/)—and outputs structured
[*MathML*](http://www.w3.org/Math/).

You can use it on the command line or on the server as an
[npm](https://npmjs.com) package, or in the browser by including the
script source. In the browser, you choose how to parse the math in
your document—by looking hard for any math-y substrings, parsing all
expressions wrapped in `$`…`$`, or using some other excellent tools out
there that does it for you. And you can choose what to do with the
output as well—piping it to another program, inject it streight to the
DOM, or just logging it to the console.


Why not just use *MathJax*?
---------------------------

[*MathJax*](http://www.mathjax.org/) is an excellent tool that you can
safely use if all you want to do is include complex mathematical
expressions in a document. However, MathJax is a complex piece of
software that does a great deal more than just translate simple
expression into structured form, and if that is all you want to do,
then MathJax is definitely overkill. Mathup promises to be a lot
faster (by doing less) then MathJax. While MathJax will search for
expressions, parse them, translate and render them. Mathup only parses
and translates them, and let the browser do the rendering.


Why AsciiMath / Why not TeΧ?
----------------------------

I wrote this tool, because I wanted to be able to author mathematical
expressions quickly, with no overhead (imagine `1/2` instead of
`\frac{1}{2}`). TeΧ expressions can easily become verbose and annoying
to write (especially on keyboards with complex access to the
<kbd> \ </kbd>, <kbd>{</kbd>, and <kbd>}</kbd> keys). However, the
purpose of this package is *not* to give people complete control over
MathML in a non-verbose way, the purpose is to make it simple for
people to write simple expression. Of course I’ll try to give as much
expressive power as possible in the way, but I won’t promise to make
all complex things possible.

If you want full support of MathML, and don’t want to write all those
tags perhaps you should look for another tool. There are other great
efforts to enable people to author MathML in TeX format, take a look
at [TeXZilla](https://github.com/fred-wang/TeXZilla) for example.


Testing
-------

Run the test suites with:

```bash
npm test
```

As for manual and visual tests, if you are running node 13 or newer,
you don’t need to compile between edit and run as the code is written
without transpilation in mind. The code works in both browsers and
node without any transcompilation.

For a simple test do:

```bash
./bin/mathup.js -- 'my expression'
```

You can open a
[playground](http://localhost:8000/demo/playground.html) and [test
cases](http://localhost:8000/demo/test-cases.html) on
<http://localhost:8000/demo> by running:

```bash
npm run server
```
