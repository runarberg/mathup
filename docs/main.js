/**
 * @typedef {import("../src/custom-element.js").default} MathUpElement
 */

const MATHJAX_SRC = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/mml-chtml.js";

/**
 * @returns {Promise<number>}
 */
function beforeAnimationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

/**
 * @param {Element} outputEl
 * @param {MathUpElement} mathupEl
 * @returns {Promise<void>}
 */
async function setupPolyfill(outputEl, mathupEl) {
  for (const example of document.querySelectorAll("use-example")) {
    if (!example.parentNode?.querySelector("mjx-container, math")) {
      /**
       * @type {MathUpElement | null | undefined}
       */
      const mathUpNode = example.shadowRoot?.querySelector("math-up");
      const mathNode = mathUpNode?.shadowRoot?.querySelector("math");

      if (mathUpNode && mathNode && example.parentNode) {
        mathUpNode.style.display = "none";
        example.parentNode.appendChild(document.importNode(mathNode, true));
      }
    }
  }

  if (!outputEl.querySelector("mjx-contaier, math")) {
    const mathNode = mathupEl?.shadowRoot?.querySelector("math");

    if (mathNode) {
      outputEl.appendChild(document.importNode(mathNode, true));
    }
  }

  mathupEl.style.display = "none";

  // @ts-ignore
  if (!window.MathJax) {
    if (document.querySelector(`script[src="${MATHJAX_SRC}"]`)) {
      await beforeAnimationFrame();
      await new Promise((resolve) => {
        window.setTimeout(resolve, 20);
      });

      setupPolyfill(outputEl, mathupEl);
      return;
    }

    const script = document.createElement("script");

    script.src = MATHJAX_SRC;
    script.async = true;
    document.head.appendChild(script);
    setupPolyfill(outputEl, mathupEl);

    return;
  }

  // @ts-ignore
  window.MathJax.typeset([outputEl]);
}

/**
 * @param {Element} outputEl
 * @param {MathUpElement} mathupEl
 * @returns {void}
 */
function removePolyfill(outputEl, mathupEl) {
  if (mathupEl) {
    mathupEl.style.removeProperty("display");
  }

  for (const mjxContainer of outputEl.querySelectorAll("mjx-container")) {
    mjxContainer.remove();
  }

  for (const mathNode of outputEl.querySelectorAll("math")) {
    mathNode.remove();
  }
}

const DEMO_EQUATIONS = [
  "E[X] = int_(-oo)^oo x f(x)  dx",
  "sum_(n=0)^k a_n = a_0 + a_1 + cdots + a_k",
  "e = sum_(n=0)^oo 1 / n!",
  "vec x = a hat i + b hat j + c hat k",
  "grad f(x,y) = ((del f)/(del x) (x, y), (del f)/(del y)(x,y))",
  "oint_(del S) bf F * d bf s = dint_S grad xx bf F * d bf s",
  "cc N(x | μ, σ^2) = 1 / (σ sqrt(2π)) e^(-1/2 (x-μ / σ)^2)",
  "`Gamma`(theta | alpha, beta) = beta^alpha / Gamma(alpha) theta^(alpha - 1) e^(-beta theta)",
  "P(A | B) = P(B | A)P(A) / P(B)",
  String.raw`phi =.^\def a/b = a+b / a`,
  "binom(n, k) = n! / k!(n-k)!",
  "|(Psi(t):) = int Psi(x, t) |(x:)  dx",
  "<<V(t)^2>> = lim_(T->oo) 1/T int_(-T/2)^(T/2) V(t)^2  dt",
  `[λ_0, λ_1, ...;] [p_(0 0), p_(0 1), ...
                  p_(1 0), p_(1 1), ...
                  vdots,   vdots,   ddots]`,
  "||(bf x)||^2 = [x_1 ; x_2 ; x_3]*[x_1 ; x_2 ; x_3]",
  `n! = { 1,       if n=0 or n=1
       n(n-1)!, if n > 1`,
  "x = -b+-sqrt(b^2 - 4ac) / 2a",
  "ln x = int_1^x 1/t  dt",
  "bf F @ bf G:  U sube RR^3 -> RR^2",
];

/**
 * @returns {void}
 */
function setupPlayground() {
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

  tryInput.value =
    DEMO_EQUATIONS[Math.floor(Math.random() * DEMO_EQUATIONS.length)];

  const tryMathUp = /** @type {MathUpElement} */ (
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
    setupPolyfill(tryOutput, tryMathUp);
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
      setupPolyfill(tryOutput, tryMathUp);
    } else {
      removePolyfill(tryOutput, tryMathUp);
    }
  });
}

/**
 * @returns {void}
 */
function setupMainNav() {
  const mainNav = document.querySelector(".main-nav");

  if (!mainNav) {
    return;
  }

  const detailsEls = mainNav.querySelectorAll("details");

  for (const el of detailsEls) {
    /** @type {(event: Event) => void} */
    const close = (event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        el.open = false;
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      if (
        !el.contains(event.target) ||
        !event.target.matches("summary, summary :scope")
      ) {
        el.open = false;
      }
    };

    el.addEventListener("toggle", () => {
      if (el.open) {
        document.addEventListener("click", close);
        document.addEventListener("keydown", close);
      } else {
        document.removeEventListener("click", close);
        document.removeEventListener("keydown", close);
      }
    });
  }
}

/**
 * @returns {void}
 */
function setupExampleSlideShow() {
  const referenceSection = document.getElementById("reference");

  /** @type {Map<Element, () => void>} */
  const activeSlideshows = new Map();

  /**
   * @param {Element} target
   * @returns {void}
   */
  function startSlideshow(target) {
    let i = 0;
    const examples = target.querySelectorAll("li");
    const interval = setInterval(() => {
      i += 1;

      if (i >= examples.length) {
        i = 0;
      }

      target.scrollTo({ left: examples[i].offsetLeft, behavior: "smooth" });
    }, 5_000);

    activeSlideshows.set(target, () => clearInterval(interval));

    /**
     *
     */
    function unobserve() {
      unobserveExamples(target);
      target.removeEventListener("wheel", unobserve);
      target.removeEventListener("pointerdown", unobserve);
    }

    target.addEventListener("wheel", unobserve);
    target.addEventListener("pointerdown", unobserve);
  }

  const slideshowObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const { target } = entry;

      if (entry.isIntersecting) {
        startSlideshow(target);
      } else {
        const stopSlideshow = activeSlideshows.get(target);

        if (stopSlideshow) {
          stopSlideshow();
          activeSlideshows.delete(target);
        }
      }
    }
  });

  /**
   * @param {Element} examples
   * @returns {void}
   */
  function unobserveExamples(examples) {
    slideshowObserver.unobserve(examples);

    const stopSlideshow = activeSlideshows.get(examples);
    if (stopSlideshow) {
      stopSlideshow();
    }
  }

  /**
   * @param {Element} examples
   * @returns {void}
   */
  function observeExamples(examples) {
    slideshowObserver.observe(examples);
  }

  const media = window.matchMedia("screen and (max-width: 80ch)");

  /**
   *
   */
  function mediaChangeHandler() {
    if (!referenceSection) {
      return;
    }

    const allExamples = referenceSection.querySelectorAll(".examples > ul");

    if (media.matches) {
      for (const examples of allExamples) {
        observeExamples(examples);
      }
    } else {
      for (const examples of allExamples) {
        unobserveExamples(examples);
      }
    }
  }

  mediaChangeHandler();
  media.addEventListener("change", mediaChangeHandler);
}

/**
 * @returns {void}
 */
function main() {
  setupPlayground();
  setupMainNav();
  setupExampleSlideShow();
}

document.addEventListener("DOMContentLoaded", main);
