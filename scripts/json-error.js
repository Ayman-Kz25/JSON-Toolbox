import {
  jsonInput,
  lineNumbers,
  errorMessage,
  errorText,
} from "./dom.js";

/**
 * ====================================
 * JSON Error Position
 * ====================================
 */

/**
 * Get line and column information
 * from a JSON syntax error.
 */
export function getJSONErrorPosition(error, input) {
  const message = error?.message || "";

  /*
   * Modern browsers usually provide:
   *
   * Unexpected token '}', ... at position 45
   */

  const positionMatch = message.match(/position\s+(\d+)/i);

  if (positionMatch) {
    const position = Number(positionMatch[1]);

    return calculatePosition(input, position);
  }

  /*
   * Some environments may provide
   * a line number directly.
   */

  const lineMatch = message.match(/line\s+(\d+)/i);

  if (lineMatch) {
    return {
      line: Number(lineMatch[1]),
      column: 1,
      position: null,
    };
  }

  /*
   * Unexpected end of JSON input.
   *
   * Put the error at the end of the input.
   */

  if (/unexpected end/i.test(message)) {
    return calculatePosition(input, input.length);
  }

  /*
   * Fallback.
   */

  return {
    line: 1,
    column: 1,
    position: null,
  };
}

/**
 * Convert a character position
 * into line and column.
 */
function calculatePosition(input, position) {
  const safePosition = Math.max(
    0,
    Math.min(position, input.length)
  );

  const beforeError = input.slice(0, safePosition);

  const lines = beforeError.split("\n");

  const line = lines.length;

  const column =
    lines[lines.length - 1].length + 1;

  return {
    line,
    column,
    position: safePosition,
  };
}

/**
 * ====================================
 * Show JSON Error
 * ====================================
 */

/**
 * Display the JSON syntax error
 * and highlight its line number.
 */
export function showJSONError(error, input) {
  if (!errorMessage || !errorText) {
    return null;
  }

  const position = getJSONErrorPosition(
    error,
    input
  );

  errorMessage.hidden = false;

  errorText.textContent =
    `Line ${position.line}, column ${position.column}: ${error.message}`;

  highlightErrorLine(position.line);

  return position;
}

/**
 * ====================================
 * Highlight Error Line
 * ====================================
 */

/**
 * Highlight the line number where
 * the JSON error occurred.
 */
export function highlightErrorLine(errorLine) {
  if (!lineNumbers || !jsonInput) {
    return;
  }

  const totalLines =
    jsonInput.value.split("\n").length;

  renderLineNumbers(
    totalLines,
    errorLine
  );
}

/**
 * ====================================
 * Update Line Numbers
 * ====================================
 */

/**
 * Update line numbers while the user
 * types into the JSON editor.
 */
export function updateLineNumbers() {
  if (!lineNumbers || !jsonInput) {
    return;
  }

  const totalLines =
    jsonInput.value.split("\n").length;

  renderLineNumbers(totalLines);
}

/**
 * ====================================
 * Render Line Numbers
 * ====================================
 */

/**
 * Render the line-number column.
 *
 * errorLine is optional.
 */
function renderLineNumbers(
  totalLines,
  errorLine = null
) {
  if (!lineNumbers) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  for (
    let line = 1;
    line <= totalLines;
    line++
  ) {
    const lineNumber =
      document.createElement("div");

    lineNumber.className = "line-number";

    lineNumber.textContent = line;

    if (line === errorLine) {
      lineNumber.classList.add("error");
    }

    fragment.appendChild(lineNumber);
  }

  lineNumbers.replaceChildren(fragment);
}

/**
 * ====================================
 * Clear JSON Error
 * ====================================
 */

/**
 * Remove the current JSON error.
 *
 * Line numbers remain visible.
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
 * ====================================
 * Initialize JSON Error Handler
 * ====================================
 */

/**
 * Initialize live line numbers and
 * textarea synchronization.
 */
export function initJSONErrorHandler() {
  if (!jsonInput || !lineNumbers) {
    return;
  }

  /*
   * Show line numbers immediately.
   */
  updateLineNumbers();

  /*
   * Update line numbers whenever
   * the user types or pastes JSON.
   */
  jsonInput.addEventListener("input", () => {
    updateLineNumbers();
  });

  /*
   * Keep line numbers synchronized
   * with vertical scrolling.
   */
  jsonInput.addEventListener(
    "scroll",
    syncLineNumbers
  );

  syncLineNumbers();
}

/**
 * ====================================
 * Synchronize Line Numbers
 * ====================================
 */

/**
 * Keep the line-number column vertically
 * synchronized with the textarea.
 */
function syncLineNumbers() {
  if (!jsonInput || !lineNumbers) {
    return;
  }

  lineNumbers.scrollTop =
    jsonInput.scrollTop;
}
