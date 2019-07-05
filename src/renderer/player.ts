import * as fs from "fs";
import * as temp from "temp";
import open from "open";

export async function startPlayer(uriBase: string, file: string) {
    let sub = await getSub(uriBase + "sub/" + file);
    let vuri = uriBase + file;

    let app = ["vlc"];
    if (sub) {
        app.push("--sub-file=" + sub);
    }

    await open(vuri, { app: app });
}

async function getSub(uri: string): Promise<string> {
    let subRes = await fetch(uri);
    if (subRes && subRes.ok) {
        let tempPath = temp.path({ suffix: ".sub" });
        let buffer = await subRes.arrayBuffer();
        if (buffer) {
            fs.writeFileSync(tempPath, Buffer.from(buffer));
            tempFiles.push(tempPath);
            return tempPath;
        }
    }
    return undefined;
}

var tempFiles: string[] = [];
export function removeTempFiles() {
    tempFiles.forEach(file => {
        fs.unlinkSync(file);
    });
}