import { replacePage, getJsonFromUrl, getGroupUrl } from "../common";
import { onFetchError } from "./error";
import { startPlayer } from "../player";
import { coverUrls } from "./mediaList";
import electronStore from "electron-store";

require("./mediaGroup.css");

const store = new electronStore();


interface GroupResponse {
    videos: VideoDetails[],
}

interface VideoDetails {
    name: string,
}


export async function showMediaGroup(uid: string) {
    const json: GroupResponse = await getJsonFromUrl(getGroupUrl(uid)).catch(() => undefined);

    if (json == undefined) {
        onFetchError();
        return;
    }

    const grid = document.createElement("div");
    grid.appendChild(createCoverDisplay(uid));
    grid.appendChild(createVideoList(uid, json.videos));
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
    const container = document.createElement("button");
    container.className = "mg-videos-item";
    container.addEventListener("click", () => {
        store.set(watched(groupId, index), true);
        container.className = "mg-videos-item mg-videos-item-watched";
        startPlayer(groupId, details.name);
    });
    container.onmousedown = (event) => {
        if (event.which == 3) {
            if (isWatched(groupId, index)) {
                store.delete(watched(groupId, index));
                container.className = "mg-videos-item";
            } else {
                store.set(watched(groupId, index), true);
                container.className = "mg-videos-item mg-videos-item-watched";
            }

        }
    }

    if (isWatched(groupId, index)) {
        container.className += " mg-videos-item-watched";
    }

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

function createCoverDisplay(uid: string) {
    const leftContainer = document.createElement("div");
    leftContainer.appendChild(createShadowElement());
    leftContainer.id = "mg-cover";

    const coverUrl = coverUrls[uid];
    if (coverUrl != undefined) {
        leftContainer.style.backgroundImage = "url(\"" + coverUrl + "\")";
    }

    return leftContainer;
}

function createShadowElement() {
    const shadow = document.createElement("div");
    shadow.id = "mg-cover-shadow";
    return shadow;
}

function watched(groupId: string, index: number) {
    return "watched." + groupId + "." + index;
}

function isWatched(groupId: string, index: number) {
    return store.get(watched(groupId, index)) === true;
}
