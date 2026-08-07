import {
  uploadBtn,
  jsonFileInput,
  jsonInput,
} from "./dom.js";

import { showToast } from "./toast.js";


export function initUploader() {
  if (!uploadBtn || !jsonFileInput) return;


  uploadBtn.addEventListener(
    "click",
    openFilePicker
  );


  jsonFileInput.addEventListener(
    "change",
    handleFileUpload
  );
}


function openFilePicker() {
  jsonFileInput.click();
}



function handleFileUpload(event) {
  const file = event.target.files[0];


  if (!file) {
    return;
  }


  if (!file.name.endsWith(".json")) {
    showToast(
      "Please upload a JSON file.",
      "warning"
    );

    resetFileInput();

    return;
  }


  const reader = new FileReader();


  reader.onload = () => {

    try {
      const content = reader.result.trim();


      JSON.parse(content);


      jsonInput.value = content;


      showToast(
        "JSON file uploaded successfully.",
        "success"
      );


    } catch (error) {

      showToast(
        "Uploaded file contains invalid JSON.",
        "error"
      );


      console.error(
        "JSON upload error:",
        error
      );
    }
  };


  reader.onerror = () => {

    showToast(
      "Failed to read the file.",
      "error"
    );
  };


  reader.readAsText(file);


  resetFileInput();
}



function resetFileInput() {
  jsonFileInput.value = "";
}
