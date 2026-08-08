import { downloadBtn, jsonOutput } from "./dom.js";
import { showToast } from "./toast.js";

let currentFormat = "json";

const fileConfig = {
  json: {
    extension: "json",
    mime: "application/json",
  },

  csv: {
    extension: "csv",
    mime: "text/csv;charset=utf-8",
  },

  xml: {
    extension: "xml",
    mime: "application/xml;charset=utf-8",
  },

  yaml: {
    extension: "yaml",
    mime: "application/x-yaml;charset=utf-8",
  },
};

export function initDownloader() {
  if (!downloadBtn) return;

  downloadBtn.addEventListener("click", downloadFile);
}

export function setDownloadFormat(format = "json") {
  const normalizedFormat = String(format).toLowerCase();

  if (fileConfig[normalizedFormat]) {
    currentFormat = normalizedFormat;
  }
}

export function downloadFile() {
  const output = jsonOutput?.value.trim();

  if (!output) {
    showToast("There is no content to download.", "warning");
    return;
  }

  const config = fileConfig[currentFormat];

  if (!config) {
    showToast("Unspported download format.", "error");
    return;
  }

  try {
    const blob = new Blob([output], {
      type: config.mime,
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `data.${config.extension}`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    showToast(
      `${config.extension.toUpperCase()} file downloaded successfully.`,
      "success",
    );
  } catch (error) {
    showToast("Failed to download file.", "error");

    console.error("File download error:", error);
  }
}
