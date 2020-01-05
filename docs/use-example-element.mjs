const STYLE_CONTENT = `
  .example-input {
    background: #202016;
    border-radius: 0.2em;
    color: #F0F0F0;
    display: inline-block;
    max-width: 100%;
    overflow-x: auto;
    padding: 0.05em 0.5em;
    text-align: left;
    font-family: "Libertinus Mono", monospace;
    font-size: 0.9em;
    white-space: pre;
  }

  .example-output {
    font-family: "Libertinus Math", "Asana Math", math;
    font-size: 1.2em;
  }
`;

class UseExampleElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const shadowStyle = document.createElement("style");
    shadowStyle.textContent = STYLE_CONTENT;
    shadow.appendChild(shadowStyle);

    const shadowRoot = document.createElement("div");
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
    code.textContent = input;
    mathUp.className = "example-output";
    mathUp.display = "block";
    mathUp.textContent = input;
    mathUp.setAttribute("inherit-font", "inherit-font");

    for (const [key, value] of Object.entries(options)) {
      if (value) {
        mathUp[key] = value;
      }
    }

    shadowRoot.appendChild(code);
    shadowRoot.appendChild(mathUp);
    shadow.appendChild(shadowRoot);
  }
}

customElements.define("use-example", UseExampleElement);
