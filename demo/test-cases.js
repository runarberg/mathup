import "../src/custom-element.js";

const STYLE_CONTENT = `
.test-case {
  font-size: 1.25em;
  margin-block-end: 2em;
}

.test-case pre {
  background: #ffc;
  border: 1px dashed black;
  border-radius: 0.2em;
  max-width: calc(100% - 2em);
  overflow-x: auto;
  padding: 0.5ex 0.5em;
  width: max-content;
}

.test-case output::before {
  content: "⇒";
  font-size: 1.5em;
  margin-inline-end: 1em;
}
`;

class TestCaseElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const shadowStyle = document.createElement("style");
    shadowStyle.textContent = STYLE_CONTENT;
    shadow.appendChild(shadowStyle);

    const shadowRoot = document.createElement("div");
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    const mathUp = document.createElement("math-up");
    const input = this.textContent.trim();
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
