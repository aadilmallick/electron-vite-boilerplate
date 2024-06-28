import { ipcMain, ipcRenderer } from "electron";

export class IPC {
  /**
   * @deprecated The method should not be used
   */
  public static sendToMain<T extends Channels>(
    channel: T,
    payload?: IPCPayload<T>
  ) {
    ipcRenderer.send(channel, payload);
  }

  static async sendToMainInvoke<T extends Channels>(
    channel: T,
    payload?: IPCPayload<T>
  ) {
    const response: IPCReturnType<T> = await ipcRenderer.invoke(
      channel,
      payload
    );
    return response;
  }

  public static listenOnRenderer<T extends Channels>(
    channel: T,
    listener: (
      event: Electron.IpcRendererEvent,
      payload?: IPCPayload<T>
    ) => Promise<void> | void
  ) {
    ipcRenderer.on(channel, listener);
  }

  public static sendToRenderer<T extends Channels>(
    browserWindow: Electron.BrowserWindow,
    channel: T,
    payload?: IPCPayload<T>
  ) {
    browserWindow.webContents.send(channel, payload);
  }

  /**
   * @deprecated The method should not be used
   */
  public static listenOnMain<T extends Channels>(
    channel: T,
    listener: (
      event: Electron.IpcMainEvent,
      payload?: IPCPayload<T>
    ) => Promise<void> | void
  ) {
    ipcMain.on(channel, listener);
  }

  static async listenOnMainHandle<T extends Channels>(
    channel: T,
    listener: (
      event: Electron.IpcMainEvent,
      payload?: IPCPayload<T>
    ) => Promise<IPCReturnType<T>>
  ) {
    ipcMain.handle(channel, listener);
  }

  public static handleEventFromMain<T extends Channels>(
    channel: T,
    cb: (payload: IPCPayloads[T]) => void | Promise<void>
  ) {
    IPC.listenOnRenderer(channel, (event, payload) => {
      cb(payload);
    });
  }
}

export type Channels = "video:upload" | "error:uploading";

export type IPCPayloads = {
  [K in Channels]: K extends "video:upload"
    ? { url: string }
    : K extends "error:uploading"
    ? { message: string }
    : void;
};

export type IPCReturns = {
  [K in Channels]: K extends "video:upload"
    ? { message: string; filepath: string; framerate: number }
    : void;
};

type IPCPayload<T extends Channels> = IPCPayloads[T];
type IPCReturnType<T extends Channels> = IPCReturns[T];
