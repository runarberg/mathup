import test from "ava";
import jsdom from "jsdom";

import toDOM from "./to-dom.js";

const { window } = new jsdom.JSDOM();

test.before("set up DOM", () => {
  globalThis.document = window.document;
  globalThis.Element = window.Element;
});

test("empty expression", (t) => {
  const nodeTree = {
    tag: "math",
    childNodes: [],
  };

  const domNode = toDOM(nodeTree, { bare: false });

  if (!(domNode instanceof globalThis.Element)) {
    t.fail("expected domNode to be instance of Element");
    return;
  }

  t.is(domNode.tagName, "math");
  t.is(domNode.namespaceURI, "http://www.w3.org/1998/Math/MathML");
  t.is(domNode.attributes.length, 0);
  t.is(domNode.childNodes.length, 0);
  t.is(domNode.textContent, "");
});

test("empty expression with attributes", (t) => {
  const nodeTree = {
    tag: "math",
    attrs: { display: "block" },
    childNodes: [],
  };

  const domNode = toDOM(nodeTree, { bare: false });

  if (!(domNode instanceof globalThis.Element)) {
    t.fail("expected domNode to be instance of Element");
    return;
  }

  t.is(domNode.tagName, "math");
  t.is(domNode.namespaceURI, "http://www.w3.org/1998/Math/MathML");
  t.is(domNode.attributes.length, 1);
  t.is(domNode.getAttribute("display"), "block");
  t.is(domNode.childNodes.length, 0);
});

test("expression with children", (t) => {
  const nodeTree = {
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
  };

  const domNode = toDOM(nodeTree, { bare: false });

  if (!(domNode instanceof globalThis.Element)) {
    t.fail("expected domNode to be instance of Element");
    return;
  }

  t.is(domNode.tagName, "math");
  t.is(domNode.namespaceURI, "http://www.w3.org/1998/Math/MathML");
  t.is(domNode.attributes.length, 0);
  t.is(domNode.childNodes.length, 1);

  const [mfrac] = domNode.childNodes;

  if (!(mfrac instanceof globalThis.Element)) {
    t.fail("expected mfrac to be instance of Element");
    return;
  }

  t.is(mfrac.tagName, "mfrac");
  t.is(mfrac.attributes.length, 1);
  t.is(mfrac.getAttribute("linethickness"), "0");
  t.is(mfrac.childNodes.length, 2);

  const [mi, mn] = mfrac.childNodes;

  if (!(mi instanceof globalThis.Element)) {
    t.fail("expected mi to be instance of Element");
    return;
  }

  t.is(mi.tagName, "mi");
  t.is(mi.attributes.length, 0);
  t.is(mi.children.length, 0);
  t.is(mi.textContent, "n");

  if (!(mn instanceof globalThis.Element)) {
    t.fail("expected mi to be instance of Element");
    return;
  }

  t.is(mn.tagName, "mn");
  t.is(mn.attributes.length, 0);
  t.is(mn.children.length, 0);
  t.is(mn.textContent, "42");
});

test("bare expression", (t) => {
  const nodeTree = {
    tag: "math",
    childNodes: [
      { tag: "mn", textContent: "1" },
      { tag: "mo", textContent: "+" },
      { tag: "mn", textContent: "1" },
    ],
  };

  const fragment = toDOM(nodeTree, { bare: true });

  t.true(fragment instanceof window.DocumentFragment);

  t.is(fragment.children.length, 3);
  t.is(fragment.children[0].tagName, "mn");
  t.is(fragment.children[0].textContent, "1");
  t.is(fragment.children[1].tagName, "mo");
  t.is(fragment.children[1].textContent, "+");
  t.is(fragment.children[2].tagName, "mn");
  t.is(fragment.children[2].textContent, "1");
});
