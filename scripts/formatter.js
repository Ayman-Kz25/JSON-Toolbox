import {
  formatBtn,
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


export function initFormatter() {
  if (!formatBtn) return;

  formatBtn.addEventListener("click", formatJSON);
}


export function formatJSON() {
  const input = jsonInput.value;

  if (!input.trim()) {
    jsonOutput.value = "";

    clearJSONError();

    showToast(
      "Please enter some JSON first.",
      "warning"
    );

    initStatus(
      "Waiting for JSON input.",
      "warning"
    );

    updateStats();

    return;
  }


  try {
    const parsedJSON = JSON.parse(input);

    const formattedJSON = JSON.stringify(
      parsedJSON,
      null,
      2
    );

    jsonOutput.value = formattedJSON;

    clearJSONError();

    updateStats();

    initStatus(
      "JSON formatted successfully.",
      "success"
    );

    showToast(
      "JSON formatted successfully.",
      "success"
    );

  } catch (error) {
    jsonOutput.value = "";

    const errorPosition = showJSONError(
      error,
      input
    );

    updateStats();

    initStatus(
      `JSON error on line ${errorPosition?.line ?? 1}.`,
      "invalid"
    );

    showToast(
      `Invalid JSON on line ${errorPosition?.line ?? 1}.`,
      "error"
    );

    console.error(
      "JSON formatting error:",
      error
    );
  }
}