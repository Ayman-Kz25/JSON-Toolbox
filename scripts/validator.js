import { jsonInput, validateBtn } from "./dom.js";
import { showToast } from "./toast.js";

export function initValidator(){
    if(!validateBtn) return;

    validateBtn.addEventListener("click", validateJSON);
}
export function validateJSON(){
    const input = jsonInput.value.trim();

    if(!input){
        showToast("Please enter some JSON first.", "warning");
        return;
    }

    try {
        JSON.parse(input);
        showToast("Valid JSON.", "success");
    } catch (error) {
        const message = getReadableError(error)
        showToast(`Invalid JSON: ${message}`, "error");
        console.log("JSON validation error:", error);
    }
}

function getReadableError(error){
    if(!error?.message){
        return "Check your JSON syntax."
    }

    return error.message.replace(/^JSON\.parse:\s*/i, "").replace(/^Unexpected token\s*/i, "Unexpected token ");
}