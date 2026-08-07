import {
  clearBtn,
  jsonInput,
  jsonOutput,
  errorMessage,
  errorText,
  jsonFileInput,
} from "./dom.js";

import { showToast } from "./toast.js";
import { updateStats } from "./stats.js";


export function initClear() {
  if (!clearBtn) return;

  clearBtn.addEventListener(
    "click",
    clearAll
  );
}


export function clearAll() {

  if (jsonInput) {
    jsonInput.value = "";
  }


  if (jsonOutput) {
    jsonOutput.value = "";
  }


  if (errorMessage) {
    errorMessage.hidden = true;
  }


  if (errorText) {
    errorText.textContent = "";
  }


  if (jsonFileInput) {
    jsonFileInput.value = "";
  }


  // Reset all counters
  updateStats();


  showToast(
    "Workspace cleared.",
    "success"
  );
}