import { validateBtn, jsonInput, jsonOutput } from "./dom.js";
import { updateStats } from "./stats.js";
import { showToast } from "./toast.js";

export function initValidator() {
  if (!validateBtn) return;

  validateBtn.addEventListener("click", validateJSON);
}

export function validateJSON() {
  const input = jsonInput.value.trim();

  if (!input) {
    showToast("Please enter some JSON first.", "warning");
    return false;
  }

  try {
    JSON.parse(input);

    updateStats();

    showToast("Valid JSON.", "success");

    return true;
  } catch (error) {
    showToast("Invalid JSON. Please check your syntax.", "error");

    console.error("JSON validation error:", error);

    return false;
  }
}
