import {
  jsonInput,
  jsonOutput,
  inputStats,
  outputStats,
  lineCount,
  characterCount,
} from "./dom.js";


export function initStats() {

  if (jsonInput) {
    jsonInput.addEventListener(
      "input",
      updateStats
    );
  }


  if (jsonOutput) {
    jsonOutput.addEventListener(
      "input",
      updateStats
    );
  }


  updateStats();
}



/**
 * Updates all counters
 */
export function updateStats() {

  const inputText = jsonInput?.value || "";

  const outputText = jsonOutput?.value || "";


  updateEditorStats(
    inputText,
    inputStats
  );


  updateEditorStats(
    outputText,
    outputStats
  );


  updateFooterStats(
    inputText
  );
}



/**
 * Updates panel statistics
 */
function updateEditorStats(text, element) {

  if (!element) return;


  const characters = text.length;

  const words = countWords(text);


  element.textContent =
    `${formatNumber(characters)} characters · ${formatNumber(words)} words`;
}



/**
 * Updates footer statistics
 */
function updateFooterStats(text) {

  if (lineCount) {

    const lines = getLineCount(text);

    lineCount.textContent =
      `${formatNumber(lines)} ${lines === 1 ? "line" : "lines"}`;
  }


  if (characterCount) {

    characterCount.textContent =
      `${formatNumber(text.length)} characters`;
  }
}



/**
 * Count words
 */
function countWords(text) {

  if (!text.trim()) {
    return 0;
  }


  return text
    .trim()
    .split(/\s+/)
    .length;
}



/**
 * Count lines
 */
function getLineCount(text) {

  if (!text) {
    return 0;
  }


  return text.split("\n").length;
}



/**
 * Adds commas for large numbers
 */
function formatNumber(number) {

  return number.toLocaleString();
}