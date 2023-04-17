import "../src/custom-element.js";

const playground = document.getElementById("playground");
const input = playground.querySelector("[name='input']");
const display = playground.querySelector("[name='display']");
const dir = playground.querySelector("[name='dir']");
const decimalMark = playground.querySelector("[name='decimal-mark']");
const colSep = playground.querySelector("[name='col-sep']");
const rowSep = playground.querySelector("[name='row-sep']");
const mathUp = playground.querySelector("math-up");

function handleInput() {
  mathUp.textContent = input.value;
}

function handleDisplayChange() {
  mathUp.display = display.checked ? display.value : "";
}

function handleDirChange() {
  mathUp.dir = dir.checked ? dir.value : "";
}

function handleDecimalMarkChange() {
  mathUp.decimalMark = decimalMark.value;
}

function handleColSepChange() {
  mathUp.colSep = colSep.value;
}

function handleRowSepChange() {
  mathUp.rowSep = rowSep.value;
}

handleInput();
handleDisplayChange();
handleDirChange();
handleDecimalMarkChange();
handleColSepChange();
handleRowSepChange();

input.addEventListener("input", handleInput);
display.addEventListener("change", handleDisplayChange);
dir.addEventListener("change", handleDirChange);
decimalMark.addEventListener("input", handleDecimalMarkChange);
colSep.addEventListener("input", handleColSepChange);
rowSep.addEventListener("input", handleRowSepChange);
