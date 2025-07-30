import test from "ava";
import { JSDOM } from "jsdom";
import mathup from "../src/index.js";

test("toDOM: should apply display: block", (t) => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  global.Element = dom.window.Element;

  const math = mathup("1/2", { display: "block" }).toDOM();
  t.is(math.getAttribute("display"), "block");
});
