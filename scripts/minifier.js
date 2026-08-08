import {
  minifyBtn,
  jsonInput,
  jsonOutput,
} from "./dom.js";

import {
  showJSONError,
  clearJSONError,
} from "./json-error.js";

import { updateStats } from "./stats.js";
import { initStatus } from "./status.js";
import { showToast } from "./toast.js";

/**
 * ====================================
 * Initialize Minifier
 * ====================================
 */

export function initMinifier() {
  if (!minifyBtn) return;

  minifyBtn.addEventListener(
    "click",
    minifyJSON
  );
}

/**
 * ====================================
 * Minify JSON
 * ====================================
 */

export function minifyJSON() {
  const input = jsonInput.value;

  /*
   * Do not modify the original input
   * before parsing it.
   */

  if (!input.trim()) {
    jsonOutput.value = "";

    clearJSONError();

    updateStats();

    initStatus(
      "Waiting for JSON input.",
      "warning"
    );

    showToast(
      "Please enter some JSON first.",
      "warning"
    );

    return;
  }

  try {
    /*
     * Parse the original input.
     *
     * JSON.parse() validates the
     * JSON syntax for us.
     */

    const parsedJSON =
      JSON.parse(input);

    /*
     * JSON.stringify() without
     * spacing produces minified JSON.
     */

    const minifiedJSON =
      JSON.stringify(parsedJSON);

    jsonOutput.value =
      minifiedJSON;

    /*
     * Remove any previous syntax
     * error and highlighted line.
     */

    clearJSONError();

    updateStats();

    initStatus(
      "JSON minified successfully.",
      "success"
    );

    showToast(
      "JSON minified successfully.",
      "success"
    );
  } catch (error) {
    /*
     * Don't show potentially invalid
     * content in the output panel.
     */

    jsonOutput.value = "";

    /*
     * Use the shared JSON error
     * handler.
     */

    const errorPosition =
      showJSONError(
        error,
        input
      );

    updateStats();

    initStatus(
      `JSON error on line ${
        errorPosition?.line ?? 1
      }.`,
      "invalid"
    );

    showToast(
      `Invalid JSON on line ${
        errorPosition?.line ?? 1
      }.`,
      "error"
    );

    console.error(
      "JSON minification error:",
      error
    );
  }
}
