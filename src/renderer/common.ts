import urljoin from "url-join";

export const requestUrl = "http://192.168.1.101:11277/";

export async function getJsonFromUrl(url: string): Promise<any> {
    return fetchTimeout(url, 4000).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw "Non-ok return";
        }
    });
}

export function replacePage(to: HTMLElement, scrollPosition?: number) {
    clearHtml();
    getRoot().appendChild(to);

    if (scrollPosition != undefined) {
        getRoot().scrollTo(0, scrollPosition);
    }
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

function fetchTimeout(url: string, timeout: number): Promise<Response> {
    const req = fetch(url);
    const tmo = new Promise((_, reject) => {
        return setTimeout(() => reject(new Error('request timeout')), timeout);
    });

    return Promise.race([req, tmo]) as Promise<Response>;
}