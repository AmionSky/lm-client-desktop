import { app, BrowserWindow } from "electron";
import { globalShortcut } from "electron";
import * as path from "path";
import { windowActions } from "./ipc";

//process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow: Electron.BrowserWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        title: "Local Media Browser",
        minWidth: 500,
        minHeight: 300,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../static/index.html"));

    windowActions(mainWindow);
    devTools(mainWindow);

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

function devTools(window: BrowserWindow) {
    globalShortcut.register("CommandOrControl+F12", () => {
        window.webContents.openDevTools();
    });
}