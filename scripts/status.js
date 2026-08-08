import {
  jsonStatus,
  statusText,
} from "./dom.js";

export function initStatus(
  message = "Ready",
  type = "default"
) {
  if (statusText) {
    statusText.textContent = message;
  }

  if (!jsonStatus) return;

  jsonStatus.className = "status-indicator";

  if (type !== "default") {
    jsonStatus.classList.add(type);
  }
}