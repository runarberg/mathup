Ascii2MathML
============

[![npm](https://img.shields.io/npm/v/ascii2mathml.svg)](https://www.npmjs.com/package/ascii2mathml)
[![Build Status](https://travis-ci.org/runarberg/ascii2mathml.svg?branch=master)](https://travis-ci.org/runarberg/ascii2mathml)

#### Installation ####

##### npm #####

```bash
npm install ascii2mathml
```

```js
import ascii2mathml = from "ascii2mathml";
```

##### Client #####

Download
[full](https://raw.githubusercontent.com/runarberg/ascii2mathml/gh-pages/dist/ascii2mathml.js)
or
[minified](https://raw.githubusercontent.com/runarberg/ascii2mathml/gh-pages/dist/ascii2mathml.min.js)
and include the script file

```html
<script src="ascii2mathml.js"></script>
ascii2mathml = ascii2mathml.default;
```

#### Usage ####

```js
var mathml = ascii2mathml(asciimath [, options]);
```

Or on the command line

```bash
npm install -g ascii2mathml

ascii2mathml [options] -- <expression>

# or from stdin
echo <expression> | ascii2mathml [options]
```

#### Options (with defaults) ####

And cli options as inline comments

```js
var options = {
    decimalMark: '.',   // -m,  --decimalmark='.'
    colSep: ',',        // -c,  --colsep=','
    rowSep: ';',        // -r,  --rowsep=';'
    display: 'inline',  // -d,  --display
    dir: 'ltr',         //      --rtl
    bare: false,        // -b,  --bare
    standalone: false,  // -s,  --standalone
    annotate: false     // -a,  --annotate
}
```

You can also call `ascii2mathml` with only a configuration object,
that will return a new function with the new defaults. For example

```js
import ascii2mathml from 'ascii2mathml';

const mathml = ({
    decimalMark: ',',
    colSep: ';',        // default if `,` is the decimal mark
    rowSep: ';;'        // default if `;` is the column separator
});

mathml('40,2');
// <math><mn>40,2</mn></math>

mathml('(40,2; 3,17; 2,72)', {bare: true});
// <mfenced open="(" close=")" separators=";"><mn>40,2</mn><mn>3,14</mn><mn>2,72</mn></mfenced>

mathml('[40,2 ;; 3,14 ;; 2,72]', {display: 'block'});
// <math display="block"><mfenced open="[" close="]"><mtable><mtr><mtd><mn>40,2</mn></mtd></mtr><mtr><mtd><mn>3,14</mn></mtd></mtr><mtr><mtd><mn>2,72</mn></mtd></mtr></mtable></mfenced></math>
```


Reference
---------

[See here](http://runarberg.github.io/ascii2mathml/#reference)


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

