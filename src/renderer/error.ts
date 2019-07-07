import { clearHtml, replacePage } from "./common";

require("./error.css");

export function onFetchError() {
    clearHtml();

    const errorDisplay = document.createElement("div");
    errorDisplay.id = "error-display";
    errorDisplay.textContent = "Failed to load";
    replacePage(errorDisplay);

    console.error("text is undefined: getTextFromUrl failed?");
}