import { minifyBtn, jsonInput, jsonOutput } from "./dom.js";
import { updateStats } from "./stats.js";
import { showToast } from "./toast.js";

export function initMinifier() {
  if (!minifyBtn) return;

  minifyBtn.addEventListener("click", minifyJSON);
}

export function minifyJSON() {
  const input = jsonInput.value.trim();

  if (!input) {
    showToast("Please enter some JSON first.", "warning");
    return;
  }

  try {
    const parsedJSON = JSON.parse(input);

    const minifiedJSON = JSON.stringify(parsedJSON);

    jsonOutput.value = minifiedJSON;

    updateStats();

    showToast("JSON minified successfully.", "success");
  } catch (error) {
    jsonOutput.value = "";

    showToast("Invalid JSON. Please check your syntax.", "error");

    console.error("JSON minification error:", error);
  }
}
