import { showMediaList } from "./pages/mediaList";
import { removeTempFiles } from "./player";
import { ipcRenderer } from "electron";
import { IpcMessages, WindowActions } from "../shared/messages";

require("./index.css");

window.onload = () => {
    document.getElementById("window-title").innerText = getWindowTitle();

    document.getElementById("nav-back").addEventListener("click", () => {
        showMediaList();
    });

    document.getElementById("window-minimize-button").addEventListener("click", () => {
        ipcRenderer.send(IpcMessages.WindowAction, WindowActions.Minimaze);
    });

    document.getElementById("window-maximize-button").addEventListener("click", () => {
        ipcRenderer.send(IpcMessages.WindowAction, WindowActions.Maximaze);
    });

    document.getElementById("window-close-button").addEventListener("click", () => {
        removeTempFiles();
        ipcRenderer.send(IpcMessages.WindowAction, WindowActions.Close);
    });

    showMediaList();
}

function getWindowTitle(): string {
    return ipcRenderer.sendSync(IpcMessages.WindowTitle);
}
