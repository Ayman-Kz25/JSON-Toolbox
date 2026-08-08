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


/* ====================================
   Initialize Formatter
==================================== */

export function initFormatter() {
  if (!formatBtn) return;

  formatBtn.addEventListener(
    "click",
    formatJSON
  );
}


/* ====================================
   Format JSON
==================================== */

export function formatJSON() {
  if (!jsonInput || !jsonOutput) return;

  const input = jsonInput.value;


  /* ====================================
     Empty Input
  ==================================== */

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


  /* ====================================
     Parse and Format
  ==================================== */

  try {
    const parsedJSON =
      JSON.parse(input);


    const formattedJSON =
      JSON.stringify(
        parsedJSON,
        null,
        2
      );


    jsonOutput.value =
      formattedJSON;


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


    const errorPosition =
      showJSONError(
        error,
        input
      );


    updateStats();


    const errorLine =
      errorPosition?.line ?? 1;


    initStatus(
      `JSON error on line ${errorLine}.`,
      "invalid"
    );


    showToast(
      `Invalid JSON on line ${errorLine}.`,
      "error"
    );


    console.error(
      "JSON formatting error:",
      error
    );
  }
}