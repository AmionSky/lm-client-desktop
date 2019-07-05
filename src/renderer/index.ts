import { showMediaList } from "./mediaList";
import { removeTempFiles } from "./player";
import { remote } from "electron";

require("./fonts.css");
require("./index.css");
require("./titlebar.css");
require("./scrollbar.css");

window.onload = () => {
    document.getElementById("window-title").innerText = getWindowTitle();

    document.getElementById("nav-back").addEventListener("click", () => {
        showMediaList();
    });

    document.getElementById("window-minimize-button").addEventListener("click", () => {
        let window = remote.getCurrentWindow();
        window.minimize();
    });

    document.getElementById("window-maximize-button").addEventListener("click", () => {
        let window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
            window.maximize();
        } else {
            window.unmaximize();
        }
    });

    document.getElementById("window-close-button").addEventListener("click", () => {
        removeTempFiles();
        let window = remote.getCurrentWindow();
        window.close();
    });

    showMediaList();
}

function getWindowTitle(): string {
    let window = remote.getCurrentWindow();
    return window.getTitle();
}
