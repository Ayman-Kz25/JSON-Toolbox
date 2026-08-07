import { conversionType, convertBtn, jsonInput, jsonOutput } from "./dom.js";
import { showToast } from "./toast.js";

export function initConverter(){
    if(!convertBtn) return;

    convertBtn.addEventListener("click", convertJSON);
}

export function convertJSON(){
    const input = jsonInput.value.trim();
    
      if (!input) {
        jsonOutput.value = "";
    
        return;
      }
    
      try {
        const data = JSON.parse(input);
    
        const type = conversionType.value;
    
        let result = "";

        switch(type){
            case "javascript":
                result = convertToJavaScript(data);
                break;
            case "query":
                result = convertToQueryString(data);
                break;
            case "json":
                result = JSON.stringify(data, null, 2);
                break;
            default:
                result = JSON.stringify(data,null,2);
        }

        jsonOutput.value = result;
      } catch (error) {
        jsonOutput.value = `Conversion failed: ${error.message}`;
      }
}

function convertToJavaScript(data){
    return `const data = ${JSON.stringify(data, null, 4)};`;
}

function convertToQueryString(data){
    if(typeof data !== "object" || data === null || Array.isArray(data)){
        throw new Error("Query string converion requires a JSON object.");
    }

    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
        if(typeof value === "object" && value !== null){
            params.append(key, JSON.stringify(value));
        } else{
            params.append(key, String(value));
        }
    });

    return params.toString();
}