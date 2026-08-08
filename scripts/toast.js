import { toastContainer } from "./dom.js";

const toastIcons = {
  success: "fa-circle-check",
  error: "fa-circle-exclamation",
  warning: "fa-triangle-exclamation",
  info: "fa-circle-info",
};

const toastTypes = new Set([
  "success",
  "error",
  "warning",
  "info",
]);

export function showToast(
  message,
  type = "info",
  duration = 3000
) {
  if (!toastContainer) return;

  // Make sure only supported toast types are used.
  const toastType = toastTypes.has(type)
    ? type
    : "info";

  const toast = document.createElement("div");

  toast.className = `toast toast-${toastType}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  const icon = document.createElement("i");

  icon.className =
    `fa-solid ${toastIcons[toastType]}`;

  icon.setAttribute("aria-hidden", "true");

  const messageText =
    document.createElement("span");

  messageText.className = "toast-message";
  messageText.textContent = message;

  toast.append(icon, messageText);

  toastContainer.appendChild(toast);

  // Allow the browser to render the initial state
  // before applying the visible state.
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}
