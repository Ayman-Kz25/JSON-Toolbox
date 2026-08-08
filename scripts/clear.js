import {
  clearBtn,
  jsonInput,
  jsonOutput,
  jsonFileInput,
} from "./dom.js";

import { showToast } from "./toast.js";
import { updateStats } from "./stats.js";
import { initStatus } from "./status.js";

import {
  clearJSONError,
} from "./json-error.js";

import {
  updateLineNumbers,
} from "./line-numbers.js";


export function initClear() {
  if (!clearBtn) return;

  clearBtn.addEventListener(
    "click",
    clearAll
  );
}


export function clearAll() {

  const isAlreadyClear =
    !jsonInput?.value.trim() &&
    !jsonOutput?.value.trim() &&
    !jsonFileInput?.value;

  if (isAlreadyClear) {

    clearJSONError();

    updateLineNumbers();

    updateStats();

    initStatus(
      "Workspace is already clear.",
      "warning"
    );

    showToast(
      "Workspace is already clear.",
      "info"
    );

    return;
  }


  // Clear input
  if (jsonInput) {
    jsonInput.value = "";
  }


  // Clear output
  if (jsonOutput) {
    jsonOutput.value = "";
  }


  // Reset file input
  if (jsonFileInput) {
    jsonFileInput.value = "";
  }


  // Clear JSON error
  clearJSONError();


  // Reset line numbers
  updateLineNumbers();


  // Reset statistics
  updateStats();


  // Update application status
  initStatus(
    "Workspace cleared.",
    "warning"
  );


  // Notify user
  showToast(
    "Workspace cleared.",
    "success"
  );
}