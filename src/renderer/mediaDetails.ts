import { replacePage, requestUrl, getTextFromUrl, getCoverUrl } from "./common";
import { onFetchError } from "./error";
import { startPlayer } from "./player";

require("./mediaDetails.css");

export async function showMediaDetails(mediaID: string) {
    const text = await getTextFromUrl(requestUrl + mediaID).catch(() => undefined);

    if (text == undefined) {
        onFetchError();
        return;
    }

    const grid = document.createElement("div");
    grid.className = "media-details-grid";

    const leftContainer = document.createElement("div");
    leftContainer.className = "media-details-left";
    const coverImage = document.createElement("img");
    coverImage.src = getCoverUrl(mediaID);
    coverImage.className = "media-details-cover";
    leftContainer.appendChild(coverImage);
    const shadow = document.createElement("div");
    shadow.className = "media-details-cover-shadow";
    leftContainer.appendChild(shadow);
    grid.appendChild(leftContainer);

    const listElement = document.createElement("div");
    listElement.className = "media-details-list";

    const lines = text.trim().split("\n");
    for (let i = 0; i < lines.length; i++) {
        const elem = createMediaItem(i, mediaID, lines[i].trim());
        listElement.appendChild(elem);
    }

    grid.appendChild(listElement);
    replacePage(grid);
}

function createMediaItem(index: number, mediaID: string, mediaItemID: string) {
    const container = document.createElement("div");
    container.className = "media-item-container";
    container.addEventListener("click", () => {
        startPlayer(requestUrl + mediaID + '/', mediaItemID);
    });

    const title = document.createElement("span");
    title.textContent = getTitle(index, mediaItemID);
    title.className = "media-item-title";
    container.appendChild(title);

    return container;
}

function getTitle(index: number, title: string) {
    let decoded = decodeURI(title).trim();
    const extIndex = decoded.lastIndexOf('.');
    if (extIndex > 0) {
        decoded = decoded.substring(0, extIndex);
    }
    return (index + 1) + ". " + decoded;
}