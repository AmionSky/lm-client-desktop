import { getVideoUrl, getSubUrl } from "./common";
import * as fs from "fs";
import * as temp from "temp";
import open from "open";

export async function startPlayer(groupId: string, videoName: string) {
    let sub = await getSub(getSubUrl(groupId, videoName));

    let app = ["vlc"];
    if (sub) {
        app.push("--sub-file=" + sub);
    }

    await open(getVideoUrl(groupId, videoName), { app: app });
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