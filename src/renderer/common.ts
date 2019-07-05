export const requestUrl = "http://192.168.1.101:11276/";

export async function getTextFromUrl(url: string): Promise<string> {
    return fetch(url).then(res => res.text()).then(resText => resText);
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

export function getCoverUrl(mediaID: string) {
    return requestUrl + mediaID + ".cover";
}
