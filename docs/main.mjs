const tryInput = document.getElementById("try-input");
const tryDisplay = document.getElementById("try-display");
const tryDir = document.getElementById("try-dir");
const tryOutput = document.getElementById("try-output");
const tryDecimalMark = document.getElementById("try-decimalmark");
const tryColSep = document.getElementById("try-colsep");
const tryRowSep = document.getElementById("try-rowsep");
const tryPolyfill = document.getElementById("try-polyfill");
const tryMathUp = tryOutput.querySelector("math-up");

tryMathUp.display = tryDisplay.checked ? tryDisplay.value : "";
tryMathUp.dir = tryDir.checked ? tryDir.value : "";
tryMathUp.decimalMark = tryDecimalMark.value;
tryMathUp.colSep = tryColSep.value;
tryMathUp.rowSep = tryRowSep.value;
tryMathUp.textContent = tryInput.value;

if (tryPolyfill.checked) {
  setupPolyfill();
}

tryInput.addEventListener("input", async event => {
  tryMathUp.textContent = event.target.value;

  if (!tryPolyfill.checked) {
    return;
  }

  await beforeAnimationFrame();
  await beforeAnimationFrame();

  const mathNode = tryMathUp.shadowRoot.querySelector("math");

  for (const node of tryOutput.querySelectorAll("mjx-container, math")) {
    node.remove();
  }

  tryOutput.appendChild(document.importNode(mathNode, true));
  window.MathJax.typeset([tryOutput]);
});

tryDecimalMark.addEventListener("change", event => {
  tryMathUp.decimalMark = event.target.value;
});

tryColSep.addEventListener("change", event => {
  tryMathUp.colSep = event.target.value;
});

tryRowSep.addEventListener("change", event => {
  tryMathUp.rowSep = event.target.value;
});

tryDisplay.addEventListener("change", event => {
  const { checked, value } = event.target;

  tryMathUp.display = checked ? value : "";
});

tryDir.addEventListener("change", event => {
  const { checked, value } = event.target;

  tryMathUp.dir = checked ? value : "";
});

tryPolyfill.addEventListener("change", event => {
  const { checked } = event.target;

  if (checked) {
    setupPolyfill();
  } else {
    removePolyfill();
  }
});

function beforeAnimationFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

const MATHJAX_SRC = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/mml-chtml.js";

async function setupPolyfill() {
  for (const example of document.querySelectorAll('use-example')) {
    if (!example.parentNode.querySelector("mjx-container, math")) {
      const mathUpNode = example.shadowRoot.querySelector("math-up");
      const mathNode = mathUpNode.shadowRoot.querySelector("math");

      if (mathNode) {
        mathUpNode.style.display = "none";
        example.parentNode.appendChild(document.importNode(mathNode, true));
      }
    }
  }

  if (!tryOutput.querySelector("mjx-contaier, math")) {
    const mathNode = tryMathUp.shadowRoot.querySelector("math");
    tryOutput.appendChild(document.importNode(mathNode, true));
  }

  if (!window.MathJax) {
    if (document.querySelector(`script[src="${MATHJAX_SRC}"]`)) {
      await beforeAnimationFrame();
      await new Promise(resolve => window.setTimeout(resolve, 20));
      setupPolyfill();
      return;
    }

    tryMathUp.style.display = "none";

    const script = document.createElement("script");

    script.src = MATHJAX_SRC;
    script.async = true;
    document.head.appendChild(script);
    setupPolyfill();
    return;
  }

  window.MathJax.typeset();
}

function removePolyfill() {
  tryMathUp.style.display = null;

  for (const mjxContainer of tryOutput.querySelectorAll("mjx-container")) {
    mjxContainer.remove();
  }

  for (const mathNode of tryOutput.querySelectorAll("math")) {
    mathNode.remove();
  }
}
