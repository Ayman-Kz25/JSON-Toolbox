import { formatBtn, jsonInput, jsonOutput } from "./dom";
import { showToast } from "./toast.js";

export function initFormatter() {
  if (!formatBtn) return;

  formatBtn.addEventListener("click", formatJSON);
}

export function formatJSON() {
  const input = jsonInput.value.trim();

  if (!input) {
    showToast("Please enter some JSON first.", "warning");

    return;
  }

  try {
    const parsedJSON = JSON.parse(input);

    const formattedJSON = JSON.stringify(parsedJSON, null, 2);

    jsonOutput.value = formattedJSON;

    showToast("JSON formatted successfully.", "success");
  } catch (error) {
    jsonOutput.value = "";
    showToast("Invalid JSON. Please check your syntax.", "error");
    console.error("JSON formatting error:", error);
  }
}
