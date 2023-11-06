import test from "ava";
import jsdom from "jsdom";

import updateDOM from "./update-dom.js";

const NS = "http://www.w3.org/1998/Math/MathML";
const { window } = new jsdom.JSDOM();
const { document, Element } = window;

/** @typedef {import("../transformer/index.js").Tag} Tag */

/**
 * @returns {MathMLElement}
 */
function createRoot() {
  return document.createElementNS(NS, "math");
}

test.before("set up DOM", () => {
  globalThis.document = window.document;
  globalThis.Element = Element;
});

test("fails if no parent", (t) => {
  // @ts-ignore
  t.throws(() => updateDOM(null));
});

test("fails if called on detached trees", (t) => {
  t.throws(() =>
    updateDOM(createRoot(), { tag: "mn", textContent: "42" }, { bare: true }),
  );
});

test("no root attr change on bare", (t) => {
  const root = createRoot();
  root.className = "my-math";

  updateDOM(root, { tag: "math" }, { bare: true });

  t.is(root.className, "my-math");

  updateDOM(root, { tag: "math" }, { bare: false });

  t.is(root.className, "");
});

test("propagate tree", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        { tag: "mn", textContent: "1" },
        { tag: "mo", textContent: "+" },
        { tag: "mn", textContent: "1" },
      ],
    },
    { bare: true },
  );

  t.is(root.childNodes.length, 3);
  t.is(root.childNodes[0].tagName, "mn");
  t.is(root.childNodes[0].textContent, "1");
  t.is(root.childNodes[1].tagName, "mo");
  t.is(root.childNodes[1].textContent, "+");
  t.is(root.childNodes[2].tagName, "mn");
  t.is(root.childNodes[2].textContent, "1");
});

test("updates tree", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        { tag: "mn", textContent: "1" },
        { tag: "mo", textContent: "+" },
        { tag: "mn", textContent: "1" },
      ],
    },
    { bare: true },
  );

  t.is(root.childNodes.length, 3);

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mfrac",
          attrs: { linethickness: "0" },
          childNodes: [
            { tag: "mi", textContent: "n" },
            { tag: "mn", textContent: "42" },
          ],
        },
      ],
    },
    { bare: true },
  );

  t.is(root.childNodes.length, 1);

  const [mfrac] = root.childNodes;

  t.is(mfrac.tagName, "mfrac");
  t.is(mfrac.attributes.length, 1);
  t.is(mfrac.getAttribute("linethickness"), "0");
  t.is(mfrac.childNodes.length, 2);

  const [mi, mn] = mfrac.childNodes;

  t.is(mi.tagName, "mi");
  t.is(mi.attributes.length, 0);
  t.is(mi.children.length, 0);
  t.is(mi.textContent, "n");

  t.is(mn.tagName, "mn");
  t.is(mn.attributes.length, 0);
  t.is(mn.children.length, 0);
  t.is(mn.textContent, "42");
});

test("adds attibutes", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [{ tag: "mtext", textContent: "foo bar" }],
    },
    { bare: true },
  );

  const [mtext] = root.childNodes;

  t.is(mtext.attributes.length, 0);

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mtext",
          attrs: { mathvariant: "double-struck" },
          textContent: "foo bar",
        },
      ],
    },
    { bare: true },
  );

  t.is(mtext.attributes.length, 1);
  t.is(mtext.getAttribute("mathvariant"), "double-struck");
});

test("replaces an attibutes", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mtext",
          attrs: { mathvariant: "double-struck" },
          textContent: "foo bar",
        },
      ],
    },
    { bare: true },
  );

  const [mtext] = root.childNodes;

  t.is(mtext.getAttribute("mathvariant"), "double-struck");

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mtext",
          attrs: { mathvariant: "bold" },
          textContent: "foo bar",
        },
      ],
    },
    { bare: true },
  );

  t.is(mtext.getAttribute("mathvariant"), "bold");
});

test("removes an attibutes", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mtext",
          attrs: { color: "rebeccapurlple", mathvariant: "double-struck" },
          textContent: "foo bar",
        },
      ],
    },
    { bare: true },
  );

  const [mtext] = root.childNodes;

  t.is(mtext.attributes.length, 2);
  t.is(mtext.getAttribute("color"), "rebeccapurlple");
  t.is(mtext.getAttribute("mathvariant"), "double-struck");

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mtext",
          attrs: { mathvariant: "bold" },
          textContent: "foo bar",
        },
      ],
    },
    { bare: true },
  );

  t.is(mtext.attributes.length, 1);
  t.is(mtext.getAttribute("mathvariant"), "bold");
});

test("alters text content", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mtext",
          textContent: "foo bar",
        },
      ],
    },
    { bare: true },
  );

  const [mtext] = root.childNodes;

  t.is(mtext.textContent, "foo bar");

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mtext",
          textContent: "baz quux",
        },
      ],
    },
    { bare: true },
  );

  t.is(mtext.textContent, "baz quux");
});

test("adds children", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [{ tag: "mrow", childNodes: [] }],
    },
    { bare: true },
  );

  const [mrow] = root.childNodes;

  t.is(mrow.children.length, 0);

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mrow",
          childNodes: [
            { tag: "mn", textContent: "1" },
            { tag: "mo", textContent: "+" },
            { tag: "mn", textContent: "1" },
          ],
        },
      ],
    },
    { bare: true },
  );

  t.is(mrow.children.length, 3);
  t.is(mrow.children[0].textContent, "1");
  t.is(mrow.children[1].textContent, "+");
  t.is(mrow.children[2].textContent, "1");
});

test("removes children", (t) => {
  const root = createRoot();

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mrow",
          childNodes: [
            { tag: "mn", textContent: "1" },
            { tag: "mo", textContent: "+" },
            { tag: "mn", textContent: "1" },
          ],
        },
      ],
    },
    { bare: true },
  );

  const [mrow] = root.childNodes;

  t.is(mrow.children.length, 3);

  updateDOM(
    root,
    {
      tag: "math",
      childNodes: [
        {
          tag: "mrow",
          childNodes: [{ tag: "mo", textContent: "+" }],
        },
      ],
    },
    { bare: true },
  );

  t.is(mrow.children.length, 1);
  t.is(mrow.children[0].tagName, "mo");
  t.is(mrow.children[0].textContent, "+");
});
