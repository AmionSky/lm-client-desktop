import { replacePage, requestUrl, getJsonFromUrl, getCoverUrl, getRoot } from "../common";
import { showMediaGroup } from "./mediaGroup";
import { onFetchError } from "./error";

require("./mediaList.css");

// Saved vertical scroll position
let scrollPosition = 0;

interface IndexResponse {
    media_list: IndexListItem[],
}

interface IndexListItem {
    uid: string,
    name: string,
}

export async function showMediaList() {
    // Get the response from server
    const json: IndexResponse = await getJsonFromUrl(requestUrl).catch(() => undefined);

    // Verify the response
    if (json == undefined) {
        onFetchError();
        return;
    }

    // Create page
    const listElement = document.createElement("div");
    listElement.id = "ml-grid";

    // Sort media groups alphabetically
    json.media_list.sort((a, b) => {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });

    // create items
    for (const item of json.media_list) {
        const elem = createMediaListItem(item);
        listElement.appendChild(elem);
    }

    replacePage(listElement, scrollPosition);
}

function createMediaListItem(item: IndexListItem) {
    const container = document.createElement("div");
    container.className = "ml-groupitem";
    container.addEventListener("click", () => {
        scrollPosition = getRoot().scrollTop;
        showMediaGroup(item.uid);
    });

    const coverImage = document.createElement("img");
    coverImage.src = getCoverUrl(item.uid);
    coverImage.className = "cover";
    container.appendChild(coverImage);

    const title = document.createElement("span");
    title.textContent = item.name
    title.className = "title";
    container.appendChild(title);

    return container;
}
