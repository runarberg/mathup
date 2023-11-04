import "../src/custom-element.js";

class TestCaseElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const shadowRoot = document.createElement("div");
    const pre = document.createElement("pre");
    pre.setAttribute("part", "input");

    const code = document.createElement("code");
    const mathUp = document.createElement("math-up");
    mathUp.setAttribute("exportparts", "math");

    const input = this?.textContent?.trim() ?? "";
    const options = {
      display: this.getAttribute("display"),
      dir: this.getAttribute("dir"),
      decimalMark: this.getAttribute("desimal-mark"),
      colSep: this.getAttribute("col-sep"),
      rowSep: this.getAttribute("row-sep"),
    };

    shadowRoot.className = "test-case";
    code.textContent = input;
    mathUp.textContent = input;

    for (const [key, value] of Object.entries(options)) {
      if (value) {
        // @ts-ignore
        mathUp[key] = value;
      }
    }

    pre.appendChild(code);
    shadowRoot.appendChild(pre);
    shadowRoot.appendChild(mathUp);
    shadow.appendChild(shadowRoot);
  }
}

customElements.define("test-case", TestCaseElement);

/** @type {HTMLSelectElement | null} */
const fontSelect = document.querySelector("select[name='font']");

function handleFontChange() {
  if (fontSelect) {
    const { value } = fontSelect;

    if (value) {
      document.documentElement.style.setProperty("--math-font-family", value);
    } else {
      document.documentElement.style.removeProperty("--math-font-family");
    }
  }
}

handleFontChange();
fontSelect?.addEventListener("change", handleFontChange);
