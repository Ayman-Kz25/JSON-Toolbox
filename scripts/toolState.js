const toolButtons = document.querySelectorAll(".tool-btn");

export function setActiveTool(button) {
  if (!button) return;

  toolButtons.forEach((toolButton) => {
    toolButton.classList.remove("active");
    toolButton.setAttribute("aria-pressed", "false");
  });

  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");
}

export function clearActiveTool() {
  toolButtons.forEach((toolButton) => {
    toolButton.classList.remove("active");
    toolButton.setAttribute("aria-pressed", "false");
  });
}

export function initToolState() {
  toolButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      setActiveTool(button);
    });
  });
}