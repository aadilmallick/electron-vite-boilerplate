import { app } from "electron";
import path from "path";
import fs from "fs/promises";

export class FileManager {
  static getFilepath(filepath: string) {
    if (process.env.NODE_ENV === "development") {
      return path.join(__dirname, "..", "..", filepath);
    } else {
      const userDataPath = app.getPath("userData");
      return path.join(userDataPath, filepath);
    }
  }

  static async exists(filePath: string) {
    try {
      await fs.access(filePath);
      return true; // The file exists
    } catch (error) {
      return false; // The file does not exist
    }
  }

  static async createDirectory(
    directoryPath: string,
    options?: {
      overwrite?: boolean;
    }
  ) {
    if (await this.exists(directoryPath)) {
      if (options?.overwrite) {
        await fs.rm(directoryPath, { recursive: true, force: true });
        await fs.mkdir(directoryPath, { recursive: true });
      }
    } else {
      await fs.mkdir(directoryPath, { recursive: true });
    }
  }
}
