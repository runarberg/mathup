function css(style) {
  const styleNode = document.createElement("style");

  styleNode.textContent = style;

  return styleNode;
}

const template = document.createElement("template");
template.content.appendChild(css`
  .example-input {
    background: #202016;
    border-radius: 0.2em;
    color: #f0f0f0;
    display: inline-block;
    max-width: 100%;
    overflow-x: auto;
    padding: 0.05em 0.5em;
    text-align: left;
    white-space: pre;
  }

  /* exportparts is not implemented in firefox */
  math-up::part(math) {
    font-family: "Libertinus Math", "Asana Math", math;
    font-size: 1.2em;
  }
`);

class UseExampleElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const shadowRoot = template.content.cloneNode(true);

    const code = document.createElement("code");
    const mathUp = document.createElement("math-up");
    const input = this.textContent.trim();
    const options = {
      display: this.getAttribute("display"),
      dir: this.getAttribute("dir"),
      decimalMark: this.getAttribute("decimal-mark"),
      colSep: this.getAttribute("col-sep"),
      rowSep: this.getAttribute("row-sep"),
    };

    code.className = "example-input";
    code.part = "code";
    code.textContent = input;
    mathUp.display = "block";
    mathUp.exportparts = "math";

    for (const [key, value] of Object.entries(options)) {
      if (value) {
        mathUp[key] = value;
      }
    }

    mathUp.textContent = input;
    shadowRoot.appendChild(code);
    shadowRoot.appendChild(mathUp);
    shadow.appendChild(shadowRoot);
  }
}

customElements.define("use-example", UseExampleElement);
