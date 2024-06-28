type Handler = (window: Electron.BrowserWindow) => Promise<void>;

export class MainListeners {
  private listeners = [] as Handler[];
  private funcs: Record<string, Handler> = {
    onSomeEvent: async (window: Electron.BrowserWindow) => {
      // triggered on some event
    },
  };

  constructor(private window: Electron.BrowserWindow) {
    for (const listener in this.funcs) {
      this.listeners.push(this.funcs[listener]);
    }
    this.registerAllListeners();
  }

  private registerAllListeners() {
    this.listeners.forEach((listener) => listener(this.window));
  }
}
