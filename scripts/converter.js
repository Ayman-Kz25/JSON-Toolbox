import {
  convertBtn,
  conversionType,
  jsonInput,
  jsonOutput,
} from "./dom.js";

import {
  showJSONError,
  clearJSONError,
} from "./json-error.js";

import { setDownloadFormat } from "./download.js";
import { updateStats } from "./stats.js";
import { initStatus } from "./status.js";
import { showToast } from "./toast.js";

export function initConverter() {
  if (!convertBtn) return;

  convertBtn.addEventListener("click", convertJSON);
}

export function convertJSON() {
  if (!jsonInput) return;

  const input = jsonInput.value;

  // Check whether the editor is empty
  if (!input.trim()) {
    jsonOutput.value = "";

    clearJSONError();
    updateStats();

    initStatus(
      "Waiting for JSON input.",
      "warning"
    );

    showToast(
      "Please enter some JSON first.",
      "warning"
    );

    return;
  }

  try {
    /*
     * Parse the original input instead of the trimmed version.
     * This keeps JSON.parse() error positions more accurate.
     */
    const parsedJSON = JSON.parse(input);

    const type = conversionType?.value;

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
        jsonOutput.value = "";

        clearJSONError();
        updateStats();

        initStatus(
          "Unsupported conversion type.",
          "invalid"
        );

        showToast(
          "Unsupported conversion type.",
          "error"
        );

        return;
    }

    /*
     * Make sure the converter actually produced output.
     */
    if (!result) {
      jsonOutput.value = "";

      clearJSONError();
      updateStats();

      initStatus(
        "Conversion produced no output.",
        "warning"
      );

      showToast(
        "The JSON could not be converted.",
        "warning"
      );

      return;
    }

    /*
     * Put converted data into the output editor.
     */
    jsonOutput.value = result;

    /*
     * Tell the downloader which format
     * should be used for the next download.
     */
    setDownloadFormat(type);

    /*
     * Clear any previous JSON syntax error.
     */
    clearJSONError();

    /*
     * Update input/output statistics.
     */
    updateStats();

    /*
     * Update application status.
     */
    initStatus(
      `JSON converted to ${type.toUpperCase()} successfully.`,
      "success"
    );

    showToast(
      `JSON converted to ${type.toUpperCase()} successfully.`,
      "success"
    );

  } catch (error) {
    /*
     * Conversion failed because the input
     * contains invalid JSON.
     */
    jsonOutput.value = "";

    /*
     * Use the shared JSON error handler.
     *
     * This should:
     * - detect the error line
     * - highlight the relevant line number
     * - display the error message
     * - return the error position
     */
    const errorPosition = showJSONError(
      error,
      input
    );

    updateStats();

    const errorLine =
      errorPosition?.line ?? 1;

    initStatus(
      `JSON error on line ${errorLine}.`,
      "invalid"
    );

    showToast(
      `Invalid JSON on line ${errorLine}.`,
      "error"
    );

    console.error(
      "JSON conversion error:",
      error
    );
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

  /*
   * Collect all unique object keys.
   *
   * This allows rows with different properties
   * to still produce a valid CSV table.
   */
  const headers = [
    ...new Set(
      data.flatMap((item) =>
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
          ? Object.keys(item)
          : []
      )
    ),
  ];

  /*
   * If the JSON contains primitive values instead
   * of objects, create a simple value column.
   */
  if (headers.length === 0) {
    const values = data.map((item) => {
      if (
        typeof item === "object" &&
        item !== null
      ) {
        return JSON.stringify(item);
      }

      return String(item ?? "");
    });

    return [
      "value",
      ...values.map(escapeCSVValue),
    ].join("\n");
  }

  const headerRow = headers
    .map(escapeCSVValue)
    .join(",");

  const rows = data.map((item) =>
    headers
      .map((header) => {
        let value = item?.[header] ?? "";

        /*
         * Convert nested objects/arrays into
         * JSON strings so CSV remains valid.
         */
        if (
          typeof value === "object" &&
          value !== null
        ) {
          value = JSON.stringify(value);
        }

        return escapeCSVValue(value);
      })
      .join(",")
  );

  return [
    headerRow,
    ...rows,
  ].join("\n");
}


/* ====================================
   CSV Escape Helper
==================================== */

function escapeCSVValue(value) {
  return `"${String(value).replaceAll(
    '"',
    '""'
  )}"`;
}


/* ====================================
   JSON → XML
==================================== */

function convertToXML(data) {

  function objectToXML(
    obj,
    nodeName = "item"
  ) {
    /*
     * Handle arrays.
     */
    if (Array.isArray(obj)) {
      return obj
        .map((item) =>
          objectToXML(item, nodeName)
        )
        .join("");
    }

    /*
     * Handle objects.
     */
    if (
      typeof obj === "object" &&
      obj !== null
    ) {
      return Object.entries(obj)
        .map(([key, value]) => {
          const safeKey =
            sanitizeXMLTag(key);

          return `<${safeKey}>${objectToXML(
            value,
            safeKey
          )}</${safeKey}>`;
        })
        .join("");
    }

    /*
     * Handle primitive values.
     */
    return escapeXML(
      String(obj)
    );
  }

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<root>${objectToXML(data)}</root>`
  );
}


/* ====================================
   XML Escape Helper
==================================== */

function escapeXML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}


/* ====================================
   XML Tag Sanitizer
==================================== */

function sanitizeXMLTag(value) {
  let tag = String(value)
    .trim()
    .replace(/[^a-zA-Z0-9_.-]/g, "_");

  /*
   * XML tag names should not begin with
   * a number, dot, or hyphen.
   */
  if (!/^[a-zA-Z_]/.test(tag)) {
    tag = `item_${tag}`;
  }

  /*
   * Prevent empty tag names.
   */
  if (!tag) {
    tag = "item";
  }

  return tag;
}


/* ====================================
   JSON → YAML
==================================== */

function convertToYAML(data) {
  if (!window.jsyaml) {
    throw new Error(
      "YAML library not loaded."
    );
  }

  return window.jsyaml.dump(
    data,
    {
      indent: 2,
      noRefs: true,
    }
  );
}
