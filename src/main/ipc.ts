import { ipcMain, BrowserWindow } from "electron";
import { IpcMessages, WindowActions } from "../shared/messages";

export function windowActions(window: BrowserWindow) {
    ipcMain.on(IpcMessages.WindowAction, (_event, arg: WindowActions) => {
        switch (arg) {
            case WindowActions.Minimaze:
                window.minimize();
                break;

            case WindowActions.Maximaze:
                if (!window.isMaximized()) {
                    window.maximize();
                } else {
                    window.unmaximize();
                }
                break;

            case WindowActions.Close:
                window.close();
                break;

            default:
                console.log("incorrect 'WindowAction' ipc")
                break;
        }
    })

    ipcMain.on(IpcMessages.WindowTitle, (event, _arg) => {
        event.returnValue = window.getTitle();
    })
}