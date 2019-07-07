import { replacePage, getJsonFromUrl, getCoverUrl, getGroupUrl } from "../common";
import { onFetchError } from "./error";
import { startPlayer } from "../player";

require("./mediaGroup.css");

interface GroupResponse {
    videos: VideoDetails[],
}

interface VideoDetails {
    name: string,
}

export async function showMediaGroup(groupId: string) {
    const json: GroupResponse = await getJsonFromUrl(getGroupUrl(groupId)).catch(() => undefined);

    if (json == undefined) {
        onFetchError();
        return;
    }


    const grid = document.createElement("div");
    grid.className = "media-group-grid";

    const leftContainer = document.createElement("div");
    leftContainer.className = "media-group-left";
    leftContainer.appendChild(createCoverElement(groupId));
    leftContainer.appendChild(createShadowElement());
    grid.appendChild(leftContainer);

    const listElement = document.createElement("div");
    listElement.className = "media-group-list";

    for (let i = 0; i < json.videos.length; i++) {
        const elem = createMediaItem(i, groupId, json.videos[i]);
        listElement.appendChild(elem);
    }

    grid.appendChild(listElement);
    replacePage(grid);
}

function createMediaItem(index: number, groupId: string, details: VideoDetails) {
    const container = document.createElement("div");
    container.className = "media-item-container";
    container.addEventListener("click", () => {
        startPlayer(groupId, details.name);
    });

    const title = document.createElement("span");
    title.textContent = getTitle(index, details.name);
    title.className = "media-item-title";
    container.appendChild(title);

    return container;
}

function getTitle(index: number, videoName: string) {
    let title = videoName;
    const extIndex = title.lastIndexOf('.');
    if (extIndex > 0) {
        title = title.substring(0, extIndex);
    }
    return (index + 1) + ". " + title;
}

function createCoverElement(groupId: string) {
    const coverImage = document.createElement("img");
    coverImage.src = getCoverUrl(groupId);
    coverImage.className = "media-group-cover";
    return coverImage;
}

function createShadowElement() {
    const shadow = document.createElement("div");
    shadow.className = "media-group-cover-shadow";
    return shadow;
}