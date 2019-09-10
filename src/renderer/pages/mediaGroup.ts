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
    grid.appendChild(createCoverDisplay(groupId));
    grid.appendChild(createVideoList(groupId, json.videos));
    grid.id = "mg-grid";
    replacePage(grid, 0);
}

function createVideoList(groupId: string, videos: VideoDetails[]) {
    const listElement = document.createElement("div");
    listElement.id = "mg-videos";

    // TODO: sort videos

    for (let i = 0; i < videos.length; i++) {
        const elem = createMediaItem(i, groupId, videos[i]);
        listElement.appendChild(elem);
    }

    return listElement;
}

function createMediaItem(index: number, groupId: string, details: VideoDetails) {
    const container = document.createElement("div");
    container.className = "mg-videos-item";
    container.addEventListener("click", () => {
        startPlayer(groupId, details.name);
    });

    const title = document.createElement("span");
    title.textContent = getTitle(index, details.name);
    title.className = "title";
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

function createCoverDisplay(groupId: string) {
    const leftContainer = document.createElement("div");
    leftContainer.style.backgroundImage = "url(\"" + getCoverUrl(groupId) + "\")";
    leftContainer.appendChild(createShadowElement());
    leftContainer.id = "mg-cover";
    return leftContainer;
}

function createShadowElement() {
    const shadow = document.createElement("div");
    shadow.id = "mg-cover-shadow";
    return shadow;
}