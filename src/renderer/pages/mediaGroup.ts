import { replacePage, getJsonFromUrl, getCoverUrl, getGroupUrl } from "../common";
import { onFetchError } from "./error";
import { startPlayer } from "../player";
import { fetchCoverUrl } from "../themoviedb";
import { IndexListItem } from "./mediaList";
import electronStore from "electron-store";

require("./mediaGroup.css");

const store = new electronStore();

interface GroupResponse {
    videos: VideoDetails[],
}

interface VideoDetails {
    name: string,
}

export async function showMediaGroup(item: IndexListItem) {
    const json: GroupResponse = await getJsonFromUrl(getGroupUrl(item.uid)).catch(() => undefined);

    if (json == undefined) {
        onFetchError();
        return;
    }

    const grid = document.createElement("div");
    grid.appendChild(createCoverDisplay(item));
    grid.appendChild(createVideoList(item.uid, json.videos));
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

function createCoverDisplay(item: IndexListItem) {
    const leftContainer = document.createElement("div");

    if (item.has_cover) {
        leftContainer.style.backgroundImage = "url(\"" + getCoverUrl(item.uid) + "\")";
    } else {
        fetchCoverUrl(item.name, "w780").then((url) => leftContainer.style.backgroundImage = "url(\"" + url + "\")");
    }

    leftContainer.appendChild(createShadowElement());
    leftContainer.id = "mg-cover";
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
