import {
  jsonInput,
  lineNumbers,
} from "./dom.js";

export function initLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  updateLineNumbers();

  jsonInput.addEventListener(
    "input",
    updateLineNumbers
  );

  jsonInput.addEventListener(
    "scroll",
    syncLineNumbers
  );
}

export function updateLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  const lineCount = Math.max(
    jsonInput.value.split("\n").length,
    1
  );

  lineNumbers.innerHTML = "";

  for (let i = 1; i <= lineCount; i++) {
    const line = document.createElement("div");

    line.className = "line-number";
    line.dataset.line = i;
    line.textContent = i;

    lineNumbers.appendChild(line);
  }

  syncLineNumbers();
}

export function syncLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  lineNumbers.scrollTop = jsonInput.scrollTop;
}

export function highlightErrorLine(lineNumber) {
  if (!lineNumbers) return;

  clearErrorLine();

  const line = lineNumbers.querySelector(
    `[data-line="${lineNumber}"]`
  );

  if (line) {
    line.classList.add("error");
  }
}

export function clearErrorLine() {
  if (!lineNumbers) return;

  const errorLine =
    lineNumbers.querySelector(".line-number.error");

  if (errorLine) {
    errorLine.classList.remove("error");
  }
}