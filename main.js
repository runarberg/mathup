// Examples

var parser = new DOMParser();
var testCases = document.querySelectorAll(".examples li");
Array.prototype.forEach.call(testCases, function (test) {
  var code = test.querySelector("code");
  var ascii = code.firstChild ? code.firstChild.textContent : "";
  var options = Object.assign({display: "block"}, code.dataset);
  var mathml = ascii2mathml(ascii, options);
  var math = parser.parseFromString(mathml, "text/html").querySelector("math");
  test.appendChild(math);
});


// Try

var tryInput = document.getElementById("try-input"),
    tryDisplay = document.getElementById("try-display"),
    tryOutput = document.getElementById("try-output"),
    tryAnnotate = document.getElementById("try-annotate"),
    tryDecimalMark = document.getElementById("try-decimalmark"),
    tryColSep = document.getElementById("try-colsep"),
    tryRowSep = document.getElementById("try-rowsep"),
    outputRender = new CustomEvent("render", {
      bubbles: true,
      cancelable: true
    });

document.addEventListener("DOMContentLoaded", renderTryBox);
tryInput.addEventListener("input", renderTryBox);
[tryDisplay, tryAnnotate].forEach(function(el) {
  el.addEventListener("change", renderTryBox);
});

function renderTryBox(event) {
  var options = {};
  if (tryDisplay.checked) options.display = "block";
  if (tryAnnotate.checked) options.annotate = "true";
  options.decimalMark = tryDecimalMark.value || '.';
  options.colSep = tryColSep.value || ',';
  options.rowSep = tryRowSep.value || ';';
  var ascii = tryInput.value,
      mathml = ascii2mathml(ascii, options);
  tryOutput.innerHTML = mathml;
  tryOutput.dispatchEvent(outputRender);
}

document.addEventListener("DOMContentLoaded", function() {
  // Focus the main try textbox
  tryInput.focus();
  var initEq = tryInput.value;
  tryInput.value = "";
  tryInput.value = initEq;

  // Prepare MathJax if the users wants it
  var documentHead = document.getElementsByTagName("head")[0];
  var mathJaxScript = document.createElement("script"),
      useMathJax = document.getElementById("use-mathjax");

  useMathJax.addEventListener("change", function(event) {
    if (useMathJax.checked && !documentHead.contains(mathJaxScript)) {
      mathJaxScript.type = "text/javascript";
      mathJaxScript.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML";
      documentHead.appendChild(mathJaxScript);
    }

    if (useMathJax.checked && documentHead.contains(mathJaxScript)) {
      // Render using mathjax
      tryOutput.addEventListener("render", renderMathJax);
      renderTryBox();
    }
    if (!useMathJax.checked) {
      // Stop rendering with mathJax
      tryOutput.removeEventListener("render", renderMathJax);
      renderTryBox();
    }
  });

  function renderMathJax(evt) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, tryOutput]);
    console.log("MathJaxing...");
  };
});
