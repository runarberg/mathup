// Examples

var parser = new DOMParser();
var testCases = document.querySelectorAll(".test-case");
Array.prototype.forEach.call(testCases, function (test) {
  var code = test.querySelector("code");
  var ascii = code.firstChild ? code.firstChild.textContent : "";
  var mathml = ascii2mathml(ascii, Object.create(code.dataset));
  var math = parser.parseFromString(mathml, "text/html").querySelector("math");
  test.appendChild(math);
});


// Try
var tryInput = document.getElementById("try-input"),
    tryDisplay = document.getElementById("try-display"),
    tryOutput = document.getElementById("try-output"),
    tryAnnotate = document.getElementById("try-annotate");

document.addEventListener("DOMContentLoaded", renderTryBox);
tryInput.addEventListener("input", renderTryBox);
[tryDisplay, tryAnnotate].forEach(function(el) {
  el.addEventListener("change", renderTryBox);
});

function renderTryBox(event) {
  var options = {};
  if (tryDisplay.checked) options.display = "block";
  if (tryAnnotate.checked) options.annotate = "true";
  var ascii = tryInput.value,
      mathml = ascii2mathml(ascii, options),
      math = parser.parseFromString(mathml, "text/html").querySelector("math");
  tryOutput.replaceChild(math, tryOutput.firstChild);
}
