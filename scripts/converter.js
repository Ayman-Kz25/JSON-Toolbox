import { convertBtn, conversionType, jsonInput, jsonOutput } from "./dom.js";
import { setDownloadFormat } from "./download.js";
import { updateStats } from "./stats.js";
import { initStatus } from "./status.js";

import { showToast } from "./toast.js";

export function initConverter() {
  if (!convertBtn) return;

  convertBtn.addEventListener("click", convertJSON);
}

export function convertJSON() {
  const input = jsonInput.value.trim();

  if (!input) {
    showToast("Please enter some JSON first.", "warning");
    return;
  }

  try {
    const parsedJSON = JSON.parse(input);

    const type = conversionType.value;

    let result = "";

    switch (type) {
      case "csv":
        result = convertToCSV(parsedJSON);
        break;

      case "xml":
        result = convertToXML(parsedJSON);
        break;

      case "yaml":
        result = convertToYAML(parsedJSON);
        break;

      default:
        showToast("Unsupported conversion type.", "error");
        return;
    }

    jsonOutput.value = result;
  
    setDownloadFormat(type);

    updateStats();

    initStatus(
      `JSON converted to ${type.toUpperCase()} successfully.`,
      "success",
    );

    showToast(
      `JSON converted to ${type.toUpperCase()} successfully.`,
      "success",
    );
  } catch (error) {
    jsonOutput.value = "";

    showToast("Invalid JSON. Please check your syntax.", "error");

    console.error("JSON conversion error:", error);
  }
}

/* ====================================
   JSON → CSV
==================================== */

function convertToCSV(data) {
  if (!Array.isArray(data)) {
    data = [data];
  }

  if (data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);

  const rows = data.map((item) =>
    headers
      .map((header) => {
        let value = item[header] ?? "";

        if (typeof value === "object") {
          value = JSON.stringify(value);
        }

        return `"${String(value).replaceAll('"', '""')}"`;
      })
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

/* ====================================
   JSON → XML
==================================== */

function convertToXML(data) {
  function objectToXML(obj, nodeName = "item") {
    if (Array.isArray(obj)) {
      return obj.map((item) => objectToXML(item, nodeName)).join("");
    }

    if (typeof obj === "object" && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => {
          return `<${key}>${objectToXML(value, key)}</${key}>`;
        })
        .join("");
    }

    return escapeXML(String(obj));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<root>${objectToXML(data)}</root>`;
}

function escapeXML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/* ====================================
   JSON → YAML
==================================== */

function convertToYAML(data) {
  if (!window.jsyaml) {
    throw new Error("YAML library not loaded.");
  }

  return window.jsyaml.dump(data, {
    indent: 2,
    noRefs: true,
  });
}
