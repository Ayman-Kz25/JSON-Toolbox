import {
  downloadBtn,
  jsonOutput,
} from "./dom.js";

import { showToast } from "./toast.js";


/* ====================================
   Current Download Format
==================================== */

let currentFormat = "json";


/* ====================================
   File Configuration
==================================== */

const fileConfig = {
  json: {
    extension: "json",
    mime: "application/json;charset=utf-8",
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


/* ====================================
   Initialize Downloader
==================================== */

export function initDownloader() {
  if (!downloadBtn) return;

  downloadBtn.addEventListener(
    "click",
    downloadFile
  );
}


/* ====================================
   Set Download Format
==================================== */

/**
 * Sets the format used when downloading
 * the current output.
 *
 * Used by converter.js.
 */

export function setDownloadFormat(
  format = "json"
) {
  const normalizedFormat =
    String(format).trim().toLowerCase();

  if (fileConfig[normalizedFormat]) {
    currentFormat = normalizedFormat;
  }
}


/* ====================================
   Download File
==================================== */

export function downloadFile() {
  const output =
    jsonOutput?.value.trim();

  if (!output) {
    showToast(
      "There is no content to download.",
      "warning"
    );

    return;
  }


  const config =
    fileConfig[currentFormat];

  if (!config) {
    showToast(
      "Unsupported download format.",
      "error"
    );

    return;
  }


  try {
    const blob = new Blob(
      [output],
      {
        type: config.mime,
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `data.${config.extension}`;

    link.style.display = "none";


    document.body.appendChild(link);

    link.click();

    link.remove();


    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);


    showToast(
      `${config.extension.toUpperCase()} file downloaded successfully.`,
      "success"
    );

  } catch (error) {

    showToast(
      "Failed to download file.",
      "error"
    );

    console.error(
      "File download error:",
      error
    );
  }
}