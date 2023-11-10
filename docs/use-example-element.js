/**
 * @param {TemplateStringsArray} style
 * @returns {HTMLStyleElement}
 */
function css(style) {
  const styleNode = document.createElement("style");

  styleNode.textContent = style.join("");

  return styleNode;
}

const template = document.createElement("template");
template.content.appendChild(css`
  .example-input {
    background: #202016;
    border-radius: 0.2em;
    color: #f0f0f0;
    display: inline-block;
    max-inline-size: 100%;
    overflow-x: auto;
    padding: 0.05em 0.5em;
    text-align: start;
    white-space: pre;
  }
`);

class UseExampleElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const shadowRoot = template.content.cloneNode(true);

    const code = document.createElement("code");
    const mathUp = /** @type {import("../src/custom-element.js").default} */ (
      document.createElement("math-up")
    );
    const input = this?.textContent?.trim() ?? "";
    const options = {
      display: this.getAttribute("display"),
      dir: this.getAttribute("dir"),
      decimalMark: this.getAttribute("decimal-mark"),
      colSep: this.getAttribute("col-sep"),
      rowSep: this.getAttribute("row-sep"),
    };

    code.className = "example-input";
    code.setAttribute("part", "code");
    code.textContent = input;

    mathUp.display = "block";
    mathUp.setAttribute("exportparts", "math");

    for (const [key, value] of Object.entries(options)) {
      if (value) {
        // @ts-ignore
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
