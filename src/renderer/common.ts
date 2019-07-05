import urljoin from "url-join";

export const requestUrl = "http://localhost:8000/";

export async function getJsonFromUrl(url: string): Promise<any> {
    return fetch(url).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw "Non-ok return";
        }
    });
}

export function replacePage(to: HTMLElement) {
    clearHtml();
    getRoot().appendChild(to);
}

export function getRoot() {
    return document.getElementById("window-content");
}

export function clearHtml() {
    const root = getRoot();
    if (root) {
        while (root.firstChild) {
            root.firstChild.remove();
        }
    }
}

export function getCoverUrl(groupId: string) {
    return urljoin(requestUrl, "cover", groupId);
}

export function getGroupUrl(groupId: string) {
    return urljoin(requestUrl, "group", groupId);
}

export function getVideoUrl(groupId: string, videoName: string) {
    return urljoin(requestUrl, "video", groupId, encodeURI(videoName));
}

export function getSubUrl(groupId: string, videoName: string) {
    return urljoin(requestUrl, "sub", groupId, encodeURI(videoName));
}
