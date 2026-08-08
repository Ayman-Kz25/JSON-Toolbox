import {
  uploadBtn,
  jsonFileInput,
  jsonInput,
} from "./dom.js";

import {
  showJSONError,
  clearJSONError,
} from "./json-error.js";

import { updateStats } from "./stats.js";
import { initStatus } from "./status.js";
import { showToast } from "./toast.js";

export function initUploader() {
  if (!uploadBtn || !jsonFileInput) return;

  uploadBtn.addEventListener(
    "click",
    openFilePicker
  );

  jsonFileInput.addEventListener(
    "change",
    handleFileUpload
  );
}

/* ====================================
   Open File Picker
==================================== */

function openFilePicker() {
  jsonFileInput.click();
}

/* ====================================
   Handle File Upload
==================================== */

function handleFileUpload(event) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const isJSONFile =
    file.name.toLowerCase().endsWith(".json") ||
    file.type === "application/json";

  if (!isJSONFile) {
    showToast(
      "Please upload a JSON file.",
      "warning"
    );

    resetFileInput();
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const content = String(reader.result ?? "");

    if (!content.trim()) {
      if (jsonInput) {
        jsonInput.value = "";
      }

      clearJSONError();
      updateStats();

      initStatus(
        "Uploaded JSON file is empty.",
        "warning"
      );

      showToast(
        "The uploaded JSON file is empty.",
        "warning"
      );

      resetFileInput();
      return;
    }

    try {
      JSON.parse(content);

      if (jsonInput) {
        jsonInput.value = content;

        /*
         * Programmatically changing textarea.value
         * does not trigger the input event.
         *
         * Dispatching it makes your line-number
         * module update immediately.
         */
        jsonInput.dispatchEvent(
          new Event("input", {
            bubbles: true,
          })
        );
      }

      clearJSONError();
      updateStats();

      initStatus(
        "JSON file uploaded successfully.",
        "success"
      );

      showToast(
        "JSON file uploaded successfully.",
        "success"
      );

    } catch (error) {
      if (jsonInput) {
        jsonInput.value = content;

        jsonInput.dispatchEvent(
          new Event("input", {
            bubbles: true,
          })
        );
      }

      const errorPosition = showJSONError(
        error,
        content
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
        "JSON upload error:",
        error
      );
    }

    resetFileInput();
  };

  reader.onerror = () => {
    showToast(
      "Failed to read the JSON file.",
      "error"
    );

    initStatus(
      "Failed to read the JSON file.",
      "invalid"
    );

    resetFileInput();
  };

  reader.readAsText(file);
}

/* ====================================
   Reset File Input
==================================== */

function resetFileInput() {
  jsonFileInput.value = "";
}
