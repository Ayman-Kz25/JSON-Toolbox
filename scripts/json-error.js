import {
  jsonInput,
  lineNumbers,
  errorMessage,
  errorText,
} from "./dom.js";

/**
 * Get line and column information from a JSON syntax error.
 */
export function getJSONErrorPosition(error, input) {
  const message = error?.message || "";

  /*
   * Modern browsers usually provide something similar to:
   *
   * Unexpected token '}', ... at position 45
   *
   * or:
   *
   * Unexpected end of JSON input
   */

  const positionMatch = message.match(/position\s+(\d+)/i);

  if (positionMatch) {
    const position = Number(positionMatch[1]);

    return calculatePosition(input, position);
  }

  /*
   * If the browser doesn't provide a character position,
   * estimate the error line from the error message.
   */
  const lineMatch = message.match(/line\s+(\d+)/i);

  if (lineMatch) {
    const line = Number(lineMatch[1]);

    return {
      line,
      column: 1,
      position: null,
    };
  }

  /*
   * For "Unexpected end of JSON input",
   * place the error at the end of the input.
   */
  if (/unexpected end/i.test(message)) {
    const position = input.length;

    return calculatePosition(input, position);
  }

  return {
    line: 1,
    column: 1,
    position: null,
  };
}


/**
 * Convert a character position into line and column.
 */
function calculatePosition(input, position) {
  const beforeError = input.slice(0, position);

  const lines = beforeError.split("\n");

  const line = lines.length;

  const column = lines[lines.length - 1].length + 1;

  return {
    line,
    column,
    position,
  };
}


/**
 * Display the JSON syntax error.
 */
export function showJSONError(error, input) {
  if (!errorMessage || !errorText) return;

  const position = getJSONErrorPosition(error, input);

  errorMessage.hidden = false;

  errorText.textContent =
    `Line ${position.line}, column ${position.column}: ${error.message}`;

  highlightErrorLine(position.line);

  return position;
}


/**
 * Highlight the line where the JSON error occurred.
 */
export function highlightErrorLine(errorLine) {
  if (!lineNumbers) return;

  const totalLines = jsonInput
    ? jsonInput.value.split("\n").length
    : 1;

  lineNumbers.innerHTML = "";

  for (let line = 1; line <= totalLines; line++) {
    const lineNumber = document.createElement("div");

    lineNumber.className = "line-number";

    lineNumber.textContent = line;

    if (line === errorLine) {
      lineNumber.classList.add("error");
    }

    lineNumbers.appendChild(lineNumber);
  }
}


/**
 * Update line numbers without an error.
 */
export function updateLineNumbers() {
  if (!lineNumbers || !jsonInput) return;

  const totalLines = jsonInput.value.split("\n").length;

  lineNumbers.innerHTML = "";

  for (let line = 1; line <= totalLines; line++) {
    const lineNumber = document.createElement("div");

    lineNumber.className = "line-number";

    lineNumber.textContent = line;

    lineNumbers.appendChild(lineNumber);
  }
}


/**
 * Clear the current JSON error.
 */
export function clearJSONError() {
  if (errorMessage) {
    errorMessage.hidden = true;
  }

  if (errorText) {
    errorText.textContent = "";
  }

  updateLineNumbers();
}


/**
 * Keep line numbers synchronized with the textarea.
 */
export function initJSONErrorHandler() {
  if (!jsonInput) return;

  updateLineNumbers();

  jsonInput.addEventListener("input", () => {
    updateLineNumbers();

    clearJSONError();
  });

  jsonInput.addEventListener("scroll", syncLineNumbers);

  syncLineNumbers();
}


/**
 * Keep the line-number column vertically synchronized
 * with the textarea scroll position.
 */
function syncLineNumbers() {
  if (!jsonInput || !lineNumbers) return;

  lineNumbers.scrollTop = jsonInput.scrollTop;
}