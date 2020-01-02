/* eslint-disable import/no-absolute-path, import/no-unresolved */
import mathup from "/src/index.mjs";

const testCases = document.getElementById("test-cases");

for (const testCase of testCases.querySelectorAll(".test-case")) {
  const conf = { ...testCase.dataset };
  const input = testCase.querySelector("code").textContent;
  const output = testCase.querySelector("output");

  output.appendChild(mathup(input, conf).toDOM());
}
