import {
  validateBtn,
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

export function initValidator() {
  if (!validateBtn) return;

  validateBtn.addEventListener("click", validateJSON);
}

export function validateJSON() {
  const input = jsonInput.value.trim();

  // Empty input
  if (!input) {
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
    JSON.parse(input);

    // JSON is valid
    clearJSONError();

    updateStats();

    initStatus(
      "Valid JSON.",
      "success"
    );

    showToast(
      "JSON is valid.",
      "success"
    );

  } catch (error) {
    // JSON is invalid
    jsonOutput.value = "";

    const errorPosition = showJSONError(
      error,
      input
    );

    updateStats();

    const line = errorPosition?.line ?? 1;

    initStatus(
      `JSON error on line ${line}.`,
      "invalid"
    );

    showToast(
      `Invalid JSON on line ${line}.`,
      "error"
    );

    console.error(
      "JSON validation error:",
      error
    );
  }
}