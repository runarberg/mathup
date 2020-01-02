/* eslint-disable import/no-absolute-path, import/no-unresolved */
import compiler from "/src/compiler/index.mjs";

const playground = document.getElementById("playground");
const input = playground.querySelector("[name='input']");
const output = playground.querySelector("[name='output']");
const compile = compiler({ display: "block" });

function handleInput() {
  for (const child of output.children) {
    child.remove();
  }

  output.appendChild(compile(input.value).toDOM());
}

handleInput();
input.addEventListener("input", handleInput);
