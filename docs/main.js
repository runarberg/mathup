/**
 * @returns {void}
 */
function main() {
  const tryInput = /** @type {HTMLTextAreaElement} */ (
    document.getElementById("try-input")
  );

  const tryDisplay = /** @type {HTMLInputElement} */ (
    document.getElementById("try-display")
  );

  const tryDir = /** @type {HTMLInputElement} */ (
    document.getElementById("try-dir")
  );

  const tryOutput = /** @type {HTMLInputElement} */ (
    document.getElementById("try-output")
  );

  const tryDecimalMark = /** @type {HTMLInputElement} */ (
    document.getElementById("try-decimalmark")
  );

  const tryColSep = /** @type {HTMLInputElement} */ (
    document.getElementById("try-colsep")
  );

  const tryRowSep = /** @type {HTMLInputElement} */ (
    document.getElementById("try-rowsep")
  );

  const tryPolyfill = /** @type {HTMLInputElement} */ (
    document.getElementById("try-polyfill")
  );

  if (
    !tryInput ||
    !tryDisplay ||
    !tryDir ||
    !tryOutput ||
    !tryDecimalMark ||
    !tryColSep ||
    !tryRowSep ||
    !tryPolyfill
  ) {
    return;
  }

  const tryMathUp = /** @type {import("../src/custom-element.js").default} */ (
    tryOutput.querySelector("math-up")
  );

  if (!tryMathUp) {
    return;
  }

  tryMathUp.display = tryDisplay.checked ? tryDisplay.value : "";
  tryMathUp.dir = tryDir.checked ? tryDir.value : "";
  tryMathUp.decimalMark = tryDecimalMark.value;
  tryMathUp.colSep = tryColSep.value;
  tryMathUp.rowSep = tryRowSep.value;
  tryMathUp.textContent = tryInput.value;

  if (tryPolyfill.checked) {
    setupPolyfill();
  }

  tryInput.addEventListener("input", async () => {
    tryMathUp.textContent = tryInput.value;

    if (!tryPolyfill.checked) {
      return;
    }

    await beforeAnimationFrame();
    await beforeAnimationFrame();

    const mathNode = tryMathUp.shadowRoot?.querySelector("math");

    if (!mathNode) {
      throw new Error("Could not get MathML node");
    }

    for (const node of tryOutput.querySelectorAll("mjx-container, math")) {
      node.remove();
    }

    tryOutput.appendChild(document.importNode(mathNode, true));

    // @ts-ignore
    window.MathJax.typeset([tryOutput]);
  });

  tryDecimalMark.addEventListener("change", () => {
    tryMathUp.decimalMark = tryDecimalMark.value;
  });

  tryColSep.addEventListener("change", () => {
    tryMathUp.colSep = tryColSep.value;
  });

  tryRowSep.addEventListener("change", () => {
    tryMathUp.rowSep = tryRowSep.value;
  });

  tryDisplay.addEventListener("change", () => {
    const { checked, value } = tryDisplay;

    tryMathUp.display = checked ? value : "";
  });

  tryDir.addEventListener("change", () => {
    const { checked, value } = tryDir;

    tryMathUp.dir = checked ? value : "";
  });

  tryPolyfill.addEventListener("change", () => {
    const { checked } = tryPolyfill;

    if (checked) {
      setupPolyfill();
    } else {
      removePolyfill();
    }
  });

  /**
   * @returns {Promise<number>}
   */
  function beforeAnimationFrame() {
    return new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  }

  const MATHJAX_SRC = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/mml-chtml.js";

  /**
   * @returns {Promise<void>}
   */
  async function setupPolyfill() {
    for (const example of document.querySelectorAll("use-example")) {
      if (!example.parentNode?.querySelector("mjx-container, math")) {
        /**
         * @type {import("../src/custom-element.js").default
         *   | null
         *   | undefined}
         */
        const mathUpNode = example.shadowRoot?.querySelector("math-up");
        const mathNode = mathUpNode?.shadowRoot?.querySelector("math");

        if (mathUpNode && mathNode && example.parentNode) {
          mathUpNode.style.display = "none";
          example.parentNode.appendChild(document.importNode(mathNode, true));
        }
      }
    }

    if (!tryOutput.querySelector("mjx-contaier, math")) {
      const mathNode = tryMathUp?.shadowRoot?.querySelector("math");

      if (mathNode) {
        tryOutput.appendChild(document.importNode(mathNode, true));
      }
    }

    tryMathUp.style.display = "none";

    // @ts-ignore
    if (!window.MathJax) {
      if (document.querySelector(`script[src="${MATHJAX_SRC}"]`)) {
        await beforeAnimationFrame();
        await new Promise((resolve) => {
          window.setTimeout(resolve, 20);
        });

        setupPolyfill();
        return;
      }

      const script = document.createElement("script");

      script.src = MATHJAX_SRC;
      script.async = true;
      document.head.appendChild(script);
      setupPolyfill();

      return;
    }

    // @ts-ignore
    window.MathJax.typeset([tryOutput]);
  }

  /**
   * @returns {void}
   */
  function removePolyfill() {
    if (tryMathUp) {
      tryMathUp.style.removeProperty("display");
    }

    for (const mjxContainer of tryOutput.querySelectorAll("mjx-container")) {
      mjxContainer.remove();
    }

    for (const mathNode of tryOutput.querySelectorAll("math")) {
      mathNode.remove();
    }
  }
}

document.addEventListener("DOMContentLoaded", main);
