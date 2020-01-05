const tryInput = document.getElementById("try-input");
const tryDisplay = document.getElementById("try-display");
const tryDir = document.getElementById("try-dir");
const tryOutput = document.getElementById("try-output");
const tryDecimalMark = document.getElementById("try-decimalmark");
const tryColSep = document.getElementById("try-colsep");
const tryRowSep = document.getElementById("try-rowsep");
const tryMathUp = tryOutput.querySelector("math-up");

tryMathUp.display = tryDisplay.checked ? tryDisplay.value : "";
tryMathUp.dir = tryDir.checked ? tryDir.value : "";
tryMathUp.decimalMark = tryDecimalMark.value;
tryMathUp.colSep = tryColSep.value;
tryMathUp.rowSep = tryRowSep.value;
tryMathUp.textContent = tryInput.value;

tryInput.addEventListener("input", event => {
  tryMathUp.textContent = event.target.value;
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

  tryMathUp.display = checked ? value : ".";
});

tryDir.addEventListener("change", event => {
  const { checked, value } = event.target;

  tryMathUp.display = checked ? value : ".";
});
