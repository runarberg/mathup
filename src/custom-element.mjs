/* eslint-env browser */

import mathup from "./index.mjs";

const template = document.createElement("template");
{
  const slot = document.createElement("slot");
  slot.style.display = "none";

  template.content.appendChild(slot);
}

export default class MathUpElement extends HTMLElement {
  constructor() {
    super();

    const options = {
      decimalMark: this.getAttribute("decimal-mark") || undefined,
      colSep: this.getAttribute("col-sep") || undefined,
      rowSep: this.getAttribute("row-sep") || undefined,
    };

    this.options = options;

    const shadow = this.attachShadow({ mode: "open" });
    const shadowRoot = template.content.cloneNode(true);

    const slot = shadowRoot.querySelector("slot");

    slot.addEventListener("slotchange", () => {
      this.update();
    });

    shadow.appendChild(shadowRoot);
  }

  update() {
    const input = this.textContent;
    const options = {
      display: this.display,
      dir: this.dir,
      decimalMark: this.decimalMark,
      colSep: this.colSep,
      rowSep: this.rowSep,
    };

    for (const oldMathNode of this.shadowRoot.querySelectorAll("math")) {
      oldMathNode.remove();
    }

    const mathNode = mathup(input, options).toDOM();
    mathNode.part = "math";

    this.shadowRoot.appendChild(mathNode);
  }

  static get observedAttributes() {
    return ["display", "dir", "decimal-mark", "col-sep", "row-sep"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const mathNode = this.shadowRoot.querySelector("math");

    if (!mathNode) {
      return;
    }

    if (name === "display" || name === "dir") {
      mathNode.setAttribute(name, newValue);
    } else if (
      name === "decimal-mark" ||
      name === "col-sep" ||
      name === "row-sep"
    ) {
      this.update();
    }
  }

  get display() {
    return this.getAttribute("display") || "inline";
  }

  set display(value) {
    this.setAttribute("display", value);
  }

  get dir() {
    return this.getAttribute("dir") || "ltr";
  }

  set dir(value) {
    this.setAttribute("dir", value);
  }

  get decimalMark() {
    return this.getAttribute("decimal-mark") || ".";
  }

  set decimalMark(value) {
    this.options.decimalMark = value || undefined;
    this.setAttribute("decimal-mark", value);
  }

  get colSep() {
    return this.getAttribute("col-sep") || ",";
  }

  set colSep(value) {
    this.options.colSep = value || undefined;
    this.setAttribute("col-sep", value);
  }

  get rowSep() {
    return this.getAttribute("row-sep") || ";";
  }

  set rowSep(value) {
    this.options.rowSep = value || undefined;
    this.setAttribute("row-sep", value);
  }
}

customElements.define("math-up", MathUpElement);
