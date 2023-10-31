import "../src/custom-element.js";

const playground = document.getElementById("playground");

if (!playground) {
  throw new Error("playground not in DOM");
}

/** @type {HTMLTextAreaElement | null} */
const input = playground.querySelector("textarea[name='input']");

/** @type {HTMLInputElement | null} */
const display = playground.querySelector("input[name='display']");

/** @type {HTMLInputElement | null} */
const dir = playground.querySelector("input[name='dir']");

/** @type {HTMLInputElement | null} */
const decimalMark = playground.querySelector("input[name='decimal-mark']");

/** @type {HTMLInputElement | null} */
const colSep = playground.querySelector("input[name='col-sep']");

/** @type {HTMLInputElement | null} */
const rowSep = playground.querySelector("input[name='row-sep']");

/** @type import("../src/custom-element.js").default | null */
const mathUp = playground.querySelector("math-up");

function handleInput() {
  if (mathUp && input) {
    mathUp.textContent = input.value;
  }
}

function handleDisplayChange() {
  if (mathUp && display) {
    mathUp.display = display.checked ? display.value : "";
  }
}

function handleDirChange() {
  if (mathUp && dir) {
    mathUp.dir = dir.checked ? dir.value : "";
  }
}

function handleDecimalMarkChange() {
  if (mathUp && decimalMark) {
    mathUp.decimalMark = decimalMark.value;
  }
}

function handleColSepChange() {
  if (mathUp && colSep) {
    mathUp.colSep = colSep.value;
  }
}

function handleRowSepChange() {
  if (mathUp && rowSep) {
    mathUp.rowSep = rowSep.value;
  }
}

handleInput();
handleDisplayChange();
handleDirChange();
handleDecimalMarkChange();
handleColSepChange();
handleRowSepChange();

input?.addEventListener("input", handleInput);
display?.addEventListener("change", handleDisplayChange);
dir?.addEventListener("change", handleDirChange);
decimalMark?.addEventListener("input", handleDecimalMarkChange);
colSep?.addEventListener("input", handleColSepChange);
rowSep?.addEventListener("input", handleRowSepChange);
