import {
  errorMessage,
  errorText,
} from "./dom.js";

import {
  highlightErrorLine,
  clearErrorLine,
} from "./line-numbers.js";

/**
 * ====================================
 * JSON Error Position
 * ====================================
 */

/**
 * Get line and column information
 * from a JSON syntax error.
 */
export function getJSONErrorPosition(
  error,
  input
) {
  const message = error?.message || "";

  /*
   * Modern browsers usually provide
   * something similar to:
   *
   * Unexpected token '}', ... at position 45
   */

  const positionMatch =
    message.match(/position\s+(\d+)/i);

  if (positionMatch) {
    const position =
      Number(positionMatch[1]);

    return calculatePosition(
      input,
      position
    );
  }

  /*
   * Some environments may provide
   * a line number directly.
   */

  const lineMatch =
    message.match(/line\s+(\d+)/i);

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
   * Put the error at the end of
   * the provided input.
   */

  if (/unexpected end/i.test(message)) {
    return calculatePosition(
      input,
      input.length
    );
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
 * ====================================
 * Calculate Position
 * ====================================
 */

/**
 * Convert a character position
 * into line and column information.
 */
function calculatePosition(
  input,
  position
) {
  const safePosition = Math.max(
    0,
    Math.min(position, input.length)
  );

  const beforeError =
    input.slice(0, safePosition);

  const lines =
    beforeError.split("\n");

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
export function showJSONError(
  error,
  input
) {
  if (!errorMessage || !errorText) {
    return null;
  }

  const position =
    getJSONErrorPosition(
      error,
      input
    );

  errorMessage.hidden = false;

  errorText.textContent =
    `Line ${position.line}, column ${position.column}: ${error.message}`;

  highlightErrorLine(
    position.line
  );

  return position;
}

/**
 * ====================================
 * Clear JSON Error
 * ====================================
 */

/**
 * Remove the current JSON error.
 *
 * The line numbers themselves are
 * controlled by line-numbers.js.
 */
export function clearJSONError() {
  if (errorMessage) {
    errorMessage.hidden = true;
  }

  if (errorText) {
    errorText.textContent = "";
  }

  clearErrorLine();
}