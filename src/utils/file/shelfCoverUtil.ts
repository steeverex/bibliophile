import { isElectron } from "react-device-detect";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import { getStorageLocation } from "../common";
import { LocalFileManager } from "./localFile";
import localforage from "localforage";
import { Buffer } from "buffer";

declare var window: any;

const SHELF_COVER_FOLDER = "shelf-covers";
const SHELF_COVER_STORE = "shelfCovers";

interface ShelfCoverMeta {
  id: string;
  extension: string;
}

const getMeta = (shelfName: string): ShelfCoverMeta | null =>
  ConfigService.getObjectConfig(shelfName, SHELF_COVER_STORE, null);

const getId = (shelfName: string) => `shelf-${encodeURIComponent(shelfName)}`;

const dataUrlToBytes = (dataUrl: string) => {
  const binary = atob(dataUrl.replace(/^data:.*;base64,/, ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
};

export default class ShelfCoverUtil {
  static async selectImage(): Promise<string> {
    if (!isElectron) return "";
    const { ipcRenderer } = window.require("electron");
    const filePath = await ipcRenderer.invoke("select-file", {
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "webp", "gif"] }],
    });
    if (!filePath) return "";
    const fs = window.require("fs");
    const path = window.require("path");
    const extension = path.extname(filePath).slice(1).toLowerCase();
    const mime = extension === "jpg" ? "image/jpeg" : `image/${extension}`;
    return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
  }

  static async save(shelfName: string, dataUrl: string): Promise<void> {
    const oldMeta = getMeta(shelfName);
    if (oldMeta) await this.remove(shelfName);
    const extension = dataUrl.match(/^data:image\/([\w+.-]+);base64,/)?.[1]?.replace("jpeg", "jpg") || "png";
    const id = getId(shelfName);
    const filename = `${id}.${extension}`;
    if (isElectron) {
      const fs = window.require("fs");
      const path = window.require("path");
      const dir = path.join(getStorageLocation() || "", SHELF_COVER_FOLDER);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, filename), Buffer.from(dataUrlToBytes(dataUrl)));
    } else if (ConfigService.getItem("isUseLocal") === "yes") {
      await LocalFileManager.saveFile(filename, dataUrlToBytes(dataUrl), SHELF_COVER_FOLDER);
    } else {
      await localforage.setItem(`shelf_cover_${id}`, dataUrl);
    }
    ConfigService.setObjectConfig(shelfName, { id, extension }, SHELF_COVER_STORE);
  }

  static async load(shelfName: string): Promise<string> {
    const meta = getMeta(shelfName);
    if (!meta) return "";
    if (isElectron) {
      const fs = window.require("fs");
      const path = window.require("path");
      const filePath = path.join(getStorageLocation() || "", SHELF_COVER_FOLDER, `${meta.id}.${meta.extension}`);
      if (!fs.existsSync(filePath)) return "";
      const mime = meta.extension === "jpg" ? "image/jpeg" : `image/${meta.extension}`;
      return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
    }
    if (ConfigService.getItem("isUseLocal") === "yes") {
      const file = await LocalFileManager.readFile(`${meta.id}.${meta.extension}`, SHELF_COVER_FOLDER);
      if (!file) return "";
      const mime = meta.extension === "jpg" ? "image/jpeg" : `image/${meta.extension}`;
      return `data:${mime};base64,${Buffer.from(file).toString("base64")}`;
    }
    return (await localforage.getItem<string>(`shelf_cover_${meta.id}`)) || "";
  }

  static async remove(shelfName: string): Promise<void> {
    const meta = getMeta(shelfName);
    if (!meta) return;
    if (isElectron) {
      const fs = window.require("fs");
      const path = window.require("path");
      const filePath = path.join(getStorageLocation() || "", SHELF_COVER_FOLDER, `${meta.id}.${meta.extension}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } else if (ConfigService.getItem("isUseLocal") === "yes") {
      await LocalFileManager.deleteFile(`${meta.id}.${meta.extension}`, SHELF_COVER_FOLDER);
    } else {
      await localforage.removeItem(`shelf_cover_${meta.id}`);
    }
    ConfigService.setObjectConfig(shelfName, null, SHELF_COVER_STORE);
  }

  static async rename(oldName: string, newName: string): Promise<void> {
    const dataUrl = await this.load(oldName);
    if (!dataUrl) return;
    await this.remove(oldName);
    await this.save(newName, dataUrl);
  }
}
