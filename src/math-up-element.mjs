/* eslint-env browser */

import mathup from "./index.mjs";

export default class MathUpElement extends HTMLElement {
  constructor() {
    super();

    const options = {
      dir: this.getAttribute("dir"),
      display: this.getAttribute("display"),

      decimalMark: this.getAttribute("decimal-mark") || undefined,
      colSep: this.getAttribute("col-sep") || undefined,
      rowSep: this.getAttribute("row-sep") || undefined,
    };

    this.options = options;

    const shadow = this.attachShadow({ mode: "open" });
    let currentMathNode = mathup(this.textContent, options).toDOM();

    const updateNode = () => {
      if (currentMathNode) {
        currentMathNode.remove();
      }

      currentMathNode = mathup(this.textContent, options).toDOM();
      shadow.appendChild(currentMathNode);
    };

    shadow.appendChild(currentMathNode);

    const observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === "childList") {
          updateNode();
        } else if (record.type === "attributes") {
          const { attributeName: name } = record;

          if (name === "display") {
            const display = this.getAttribute("display");

            if (display) {
              options.display = display;
              currentMathNode.setAttribute("display", display);
            } else {
              delete options.display;
              currentMathNode.removeAttribute("display");
            }
          } else if (name === "dir") {
            const dir = this.getAttribute("dir");

            if (dir) {
              options.dir = dir;
              currentMathNode.setAttribute("dir", dir);
            } else {
              delete options.dir;
              currentMathNode.removeAttribute("dir");
            }
          } else if (
            name === "col-sep" ||
            name === "row-sep" ||
            name === "decimal-mark"
          ) {
            const key = name.replace(/-([a-z])/g, (_, $1) =>
              $1.toLocaleUpperCase(),
            );
            const value = options[key];

            if (value) {
              options[key] = value;
            } else {
              delete options[key];
            }

            updateNode();
          }
        }
      });
    });

    observer.observe(this, {
      childList: true,
      attributes: true,
    });
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
    return this.getAttribute("row-sep") || ",";
  }

  set rowSep(value) {
    this.options.rowSep = value || undefined;
    this.setAttribute("row-sep", value);
  }
}

customElements.define("math-up", MathUpElement);
