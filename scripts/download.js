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
    mime: "text/csv",
  },

  xml: {
    extension: "xml",
    mime: "application/xml",
  },

  yaml: {
    extension: "yaml",
    mime: "application/x-yaml",
  },
};


export function initDownloader() {
  if (!downloadBtn) return;

  downloadBtn.addEventListener("click", downloadFile);
}


/**
 * Set current download format.
 * Used by converter.js
 */
export function setDownloadFormat(format = "json") {
  if (fileConfig[format]) {
    currentFormat = format;
  }
}


export function downloadFile() {
  const output = jsonOutput.value.trim();


  if (!output) {
    showToast("There is no content to download.", "warning");
    return;
  }


  try {
    const config = fileConfig[currentFormat];


    const blob = new Blob(
      [output],
      {
        type: config.mime,
      }
    );


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
