import { initConverter } from "./scripts/converter.js";
import {initFormatter} from "./scripts/formatter.js";
import { initMinifier } from "./scripts/minifier.js";
import { initValidator } from "./scripts/validator.js";

function initApp(){
    initFormatter();
    initMinifier();
    initConverter();
    initValidator();
}

initApp();