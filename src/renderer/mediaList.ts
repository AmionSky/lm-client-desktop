import { replacePage, requestUrl, getTextFromUrl, getCoverUrl } from "./common";
import { showMediaDetails } from "./mediaDetails";
import { onFetchError } from "./error";

require("./mediaList.css");

export async function showMediaList() {
    const text = await getTextFromUrl(requestUrl).catch(() => undefined);

    if (text == undefined) {
        onFetchError();
        return;
    }

    const listElement = document.createElement("div");
    listElement.className = "media-list-container";

    const lines = text.trim().split("\n");
    for (const line of lines) {
        const elem = createMediaListItem(line.trim());
        listElement.appendChild(elem);
    }

    replacePage(listElement);
}

function createMediaListItem(mediaID: string) {
    const container = document.createElement("div");
    container.className = "media-listitem-container";
    container.addEventListener("click", () => {
        showMediaDetails(mediaID);
    });

    const coverImage = document.createElement("img");
    coverImage.src = getCoverUrl(mediaID);
    coverImage.className = "media-listitem-cover";
    container.appendChild(coverImage);

    const title = document.createElement("span");
    title.textContent = decodeURI(mediaID).trim();
    title.className = "media-listitem-title";
    container.appendChild(title);

    return container;
}
