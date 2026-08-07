import { toastContainer } from "./dom.js";

const toastIcons = {
  success: "fa-circle-check",
  error: "fa-circle-exclamation",
  warning: "fa-triangle-exclamation",
  info: "fa-circle-info",
};

export function showToast(message, type = "info", duration = 3000) {
  if (!toastContainer) return;

  const toast = document.createElement("div");

  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");

  const icon = document.createElement("i");

  icon.className = `fa-solid ${toastIcons[type] || toastIcons.info}`;
  icon.setAttribute("aria-hidden", "true");

  const messageText = document.createElement("span");

  messageText.textContent = message;

  toast.append(icon, messageText);

  toastContainer.appendChild(toast);

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
