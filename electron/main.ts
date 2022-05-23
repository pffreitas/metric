import { app, BrowserWindow, ipcMain } from 'electron'

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function UpsertKeyValue(obj: Record<string, string> | Record<string, string[]> | undefined, keyToChange: string, value: string[]) {
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      // Reassign old key
      obj[key] = value;
      // Done
      return;
    }
  }
  // Insert at end instead
  obj[keyToChange] = value;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })


  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const { requestHeaders } = details;
      UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
      callback({ requestHeaders });
    },
  );
  
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    callback({
      responseHeaders,
    });
  });

}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
