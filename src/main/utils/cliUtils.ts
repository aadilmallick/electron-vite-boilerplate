import { Print } from "@2022amallick/print-colors";
import { spawnSync, spawn, execFile } from "child_process";
import * as path from "path";

class LinuxError extends Error {
  constructor(command: string, extraData?: string) {
    super(`Running the '${command}' command caused this error`);
    console.error(extraData);
  }
}

export default class CLI {
  static async linuxWithData(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, { shell: true });

      let output = "";
      let errorOutput = "";

      child.stdout.on("data", (data) => {
        output += data.toString();
      });

      child.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new LinuxError(command, `${errorOutput}`));
        } else {
          resolve(output.trim());
        }
      });
    });
  }

  static cmdFilepath(
    filepath: string,
    command: string,
    options?: { cwd?: string }
  ): Promise<string> {
    const args = command.split(" ");
    const cliOptions = options ? options : {};
    return new Promise((resolve, reject) => {
      execFile(
        filepath,
        args,
        {
          maxBuffer: 500 * 1_000_000,
          ...cliOptions,
        },
        (error, stdout, stderr) => {
          if (error) {
            Print.yellow(`Error executing ${path.basename(filepath)}:`, error);
            reject(stderr);
          } else {
            resolve(stdout);
          }
        }
      );
    });
  }
}
