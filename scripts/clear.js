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
import { initStatus, setStatus } from "./status.js";


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
    !jsonFileInput?.value &&
    errorMessage?.hidden !== false;


  if (isAlreadyClear) {

    setStatus(
      "Workspace is already clear",
      "warning"
    );


    showToast(
      "Workspace is already clear.",
      "info"
    );


    return;
  }



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


  // Reset counters
  updateStats();


  initStatus(
    "Workspace cleared",
    "warning"
  );


  showToast(
    "Workspace cleared.",
    "success"
  );
}