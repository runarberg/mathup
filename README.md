mathup
======

[![npm](https://img.shields.io/npm/v/mathup.svg)](https://www.npmjs.com/package/mathup)
[![License](https://img.shields.io/npm/l/mathup)](LICENSE)
[![Build Status](https://travis-ci.org/runarberg/mathup.svg?branch=master)](https://travis-ci.org/runarberg/mathup)
[![Coverage Status](https://coveralls.io/repos/github/runarberg/mathup/badge.svg)](https://coveralls.io/github/runarberg/mathup)
[![Downloads](https://img.shields.io/npm/dm/mathup)](https://npm-stat.com/charts.html?package=mathup)  
[![dependencies](https://david-dm.org/runarberg/mathup/status.svg)](https://david-dm.org/runarberg/mathup)
[![dev-dependencies](https://david-dm.org/runarberg/mathup/dev-status.svg)](https://david-dm.org/runarberg/mathup?type=dev)
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

Download
[full](https://raw.githubusercontent.com/runarberg/mathup/gh-pages/dist/mathup.js)
or
[minified](https://raw.githubusercontent.com/runarberg/mathup/gh-pages/dist/mathup.min.js)
and include the script file

```html
<script src="mathup.js"></script>
```

#### Usage ####

```js
var mathml = mathup(input [, options]);

console.log(mathml.toString());
document.body.appendChild(mathml.toDOM());
```

Or on the command line

```bash
npm install -g mathup

mathup [options] -- <expression>

# or from stdin
echo <expression> | mathup [options]
```

#### Options (with defaults) ####

And cli options as inline comments

```js
import mathup from "mathup";

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
simple mathematical expressions written in a dialog similar to
[*AsciiMath*](http://asciimath.org/), and outputs verbose and ugly
(but structured) [*MathML*](http://www.w3.org/Math/). That is all it
does.

You can use it on the command line or on the server as an
[npm](http://npmjs.com/) package, or in the browser by including the
script source. In the browser, you choose how to parse the math in
your document (by looking hard for any math-y substrings, parsing all
expressions wrapped in `$`…`$`, or using some other excellent tools
out there that does it for you). And you can choose what to do with
the output as well (piping it to another program, calling your
favorite DOM parser to inject it, or just logging it to the console).


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
do, then MathJax is definitely overkill. Mathup promises to be a
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
./bin/mathup.mjs -- 'my expression'
```

You can open a playground and a demo on <http://localhost:8000/demo>
or the documentation on <http://localhost:8000/docs> with:

```bash
npm run server
```
