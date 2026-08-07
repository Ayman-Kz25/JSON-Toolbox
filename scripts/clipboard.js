import { copyBtn, jsonOutput } from "./dom.js";
import { showToast } from "./toast.js";

export function initClipboard() {
  if (!copyBtn) return;

  copyBtn.addEventListener("click", copyJSON);
}

export async function copyJSON() {
  const output = jsonOutput.value.trim();

  if (!output) {
    showToast("There is no JSON to copy.", "warning");
    return;
  }

  if (!navigator.clipboard) {
    showToast("Clipboard access is not supported.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(output);

    showToast("JSON copied to clipboard.", "success");
  } catch (error) {
    showToast("Failed to copy JSON.", "error");

    console.error("Clipboard error:", error);
  }
}
