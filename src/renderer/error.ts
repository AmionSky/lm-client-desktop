import { clearHtml, replacePage } from "./common";

export function onFetchError() {
    clearHtml();

    const errorDisplay = document.createElement("span");
    errorDisplay.textContent = "Failed to load";
    replacePage(errorDisplay);

    console.error("text is undefined: getTextFromUrl failed?");
}