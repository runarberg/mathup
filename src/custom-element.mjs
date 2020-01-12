/* eslint-env browser */

import mathup from "./index.mjs";

const template = document.createElement("template");
{
  const slot = document.createElement("slot");
  const math = document.createElementNS(
    "http://www.w3.org/1998/Math/MathML",
    "math",
  );

  slot.style.display = "none";
  math.part = "math";

  template.content.appendChild(slot);
  template.content.appendChild(math);
}

export default class MathUpElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const shadowRoot = template.content.cloneNode(true);

    const slot = shadowRoot.querySelector("slot");

    slot.addEventListener("slotchange", () => {
      this.update();
    });

    shadow.appendChild(shadowRoot);
  }

  update() {
    if (this.updateRequest) {
      // Only perform once per animation frame.
      window.cancelAnimationFrame(this.updateRequest);
    }

    const input = this.textContent;
    const options = {
      decimalMark: this.decimalMark,
      colSep: this.colSep,
      rowSep: this.rowSep,

      bare: true,
    };

    const mathNode = this.shadowRoot.querySelector("math");

    this.updateRequest = window.requestAnimationFrame(() => {
      mathup(input, options).updateDOM(mathNode);
    });
  }

  static get observedAttributes() {
    return ["display", "dir", "decimal-mark", "col-sep", "row-sep"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const mathNode = this.shadowRoot.querySelector("math");

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
    this.setAttribute("decimal-mark", value);
  }

  get colSep() {
    return this.getAttribute("col-sep") || ",";
  }

  set colSep(value) {
    this.setAttribute("col-sep", value);
  }

  get rowSep() {
    return this.getAttribute("row-sep") || ";";
  }

  set rowSep(value) {
    this.setAttribute("row-sep", value);
  }
}

customElements.define("math-up", MathUpElement);
