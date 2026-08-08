import { initClear } from "./scripts/clear.js";
import { initClipboard } from "./scripts/clipboard.js";
import { initConverter } from "./scripts/converter.js";
import { initDownloader } from "./scripts/download.js";
import {initFormatter} from "./scripts/formatter.js";
import { initMinifier } from "./scripts/minifier.js";
import { initStats } from "./scripts/stats.js";
import { initStatus } from "./scripts/status.js";
import { initTheme } from "./scripts/theme.js";
import { initToolState } from "./scripts/toolState.js";
import { initUploader } from "./scripts/upload.js";
import { initValidator } from "./scripts/validator.js";

function initApp(){
    initFormatter();
    initMinifier();
    initValidator();
    initClipboard();
    initDownloader();
    initConverter();
    initTheme();
    initUploader();
    initClear();
    initStats();
    initStatus();
    initToolState();
}

initApp();