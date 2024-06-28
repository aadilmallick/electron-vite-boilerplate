// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";

const appApi = {
  // enter functions here
} as const;

contextBridge.exposeInMainWorld("appApi", appApi);

export type AppApi = typeof appApi;
