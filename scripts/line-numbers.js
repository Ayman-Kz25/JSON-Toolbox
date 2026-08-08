import {
  jsonInput,
  lineNumbers,
} from "./dom.js";

/**
 * ====================================
 * Initialize Line Numbers
 * ====================================
 */

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

/**
 * ====================================
 * Update Line Numbers
 * ====================================
 */

export function updateLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  const lines =
    jsonInput.value.split("\n").length;

  const fragment =
    document.createDocumentFragment();

  for (let i = 1; i <= lines; i++) {
    const lineElement =
      document.createElement("div");

    lineElement.className = "line-number";

    lineElement.dataset.line = i;

    lineElement.textContent = i;

    fragment.appendChild(lineElement);
  }

  lineNumbers.replaceChildren(fragment);

  syncLineNumbers();
}

/**
 * ====================================
 * Sync Scroll
 * ====================================
 */

export function syncLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  lineNumbers.scrollTop =
    jsonInput.scrollTop;
}

/**
 * ====================================
 * Editor Keyboard Handling
 * ====================================
 */

function handleEditorKeydown(event) {
  if (!jsonInput) return;

  /*
   * Insert two spaces when Tab
   * is pressed inside the editor.
   */

  if (event.key === "Tab") {
    event.preventDefault();

    const start =
      jsonInput.selectionStart;

    const end =
      jsonInput.selectionEnd;

    const value = jsonInput.value;

    jsonInput.value =
      value.substring(0, start) +
      "  " +
      value.substring(end);

    const cursorPosition =
      start + 2;

    jsonInput.selectionStart =
      cursorPosition;

    jsonInput.selectionEnd =
      cursorPosition;

    updateLineNumbers();

    /*
     * Trigger the normal input event
     * so other modules can react to
     * the changed editor content.
     */
    jsonInput.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );
  }
}

/**
 * ====================================
 * Highlight Error Line
 * ====================================
 */

export function highlightErrorLine(line) {
  if (!lineNumbers) return;

  clearErrorLine();

  const errorLine = Number(line);

  if (!Number.isInteger(errorLine)) {
    return;
  }

  if (errorLine < 1) {
    return;
  }

  const lineElement =
    lineNumbers.querySelector(
      `[data-line="${errorLine}"]`
    );

  if (!lineElement) {
    return;
  }

  lineElement.classList.add("error");
}

/**
 * ====================================
 * Clear Error Line
 * ====================================
 */

export function clearErrorLine() {
  if (!lineNumbers) return;

  lineNumbers
    .querySelectorAll(
      ".line-number.error"
    )
    .forEach((element) => {
      element.classList.remove("error");
    });
}
