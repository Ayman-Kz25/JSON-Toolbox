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

  jsonInput.addEventListener(
    "keydown",
    handleEditorKeydown
  );
}


/* ====================================
   Update Line Numbers
==================================== */

export function updateLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  const lines = jsonInput.value.split("\n").length;

  let html = "";

  for (let i = 1; i <= lines; i++) {
    html += `
      <div
        class="line-number"
        data-line="${i}"
      >
        ${i}
      </div>
    `;
  }

  lineNumbers.innerHTML = html;

  syncLineNumbers();
}


/* ====================================
   Sync Scroll
==================================== */

export function syncLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  lineNumbers.scrollTop = jsonInput.scrollTop;
}


/* ====================================
   Editor Keyboard Handling
==================================== */

function handleEditorKeydown(event) {
  if (!jsonInput) return;

  if (event.key === "Tab") {
    event.preventDefault();

    const start = jsonInput.selectionStart;
    const end = jsonInput.selectionEnd;

    jsonInput.value =
      jsonInput.value.substring(0, start) +
      "  " +
      jsonInput.value.substring(end);

    jsonInput.selectionStart = start + 2;
    jsonInput.selectionEnd = start + 2;

    updateLineNumbers();
  }
}


/* ====================================
   Highlight Error Line
==================================== */

export function highlightErrorLine(line) {
  if (!lineNumbers) return;

  clearErrorLine();

  if (!line || line < 1) return;

  const lineElement =
    lineNumbers.querySelector(
      `[data-line="${line}"]`
    );

  if (!lineElement) return;

  lineElement.classList.add("error");
}


/* ====================================
   Clear Error Line
==================================== */

export function clearErrorLine() {
  if (!lineNumbers) return;

  lineNumbers
    .querySelectorAll(".line-number.error")
    .forEach((element) => {
      element.classList.remove("error");
    });
}