const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow = null;
let object2Window = null;
let object3Window = null;

const VITE_DEV_URL = "http://localhost:5173";

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 620,
    height: 540,
    x: 100,
    y: 100,
    title: "Lab6 — Головний менеджер",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`${VITE_DEV_URL}/index.html`);

  mainWindow.on("closed", () => {
    if (object2Window && !object2Window.isDestroyed()) object2Window.close();
    if (object3Window && !object3Window.isDestroyed()) object3Window.close();
    mainWindow = null;
  });
}

function createChildWindows(params) {
  let readyCount = 0;
  const checkAndSend = () => {
    readyCount++;
    if (readyCount === 2 && object2Window && !object2Window.isDestroyed()) {
      object2Window.webContents.send("generate-matrix", params);
    }
  };

  if (!object2Window || object2Window.isDestroyed()) {
    object2Window = new BrowserWindow({
      width: 460,
      height: 460,
      x: 740,
      y: 100,
      title: "Object2 — Генератор матриці",
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    object2Window.loadURL(`${VITE_DEV_URL}/object2.html`);
    object2Window.webContents.once("did-finish-load", checkAndSend);
  } else {
    object2Window.focus();
    readyCount++;
  }

  if (!object3Window || object3Window.isDestroyed()) {
    object3Window = new BrowserWindow({
      width: 460,
      height: 420,
      x: 740,
      y: 580,
      title: "Object3 — Обчислювач детермінанта",
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    object3Window.loadURL(`${VITE_DEV_URL}/object3.html`);
    object3Window.webContents.once("did-finish-load", checkAndSend);
  } else {
    object3Window.focus();
    readyCount++;
  }

  if (readyCount === 2) {
    object2Window.webContents.send("generate-matrix", params);
  }
}

ipcMain.on("start-and-generate", (_event, params) => {
  createChildWindows(params);
});

ipcMain.on("matrix-data", (_event, matrix) => {
  if (object3Window && !object3Window.isDestroyed()) {
    object3Window.webContents.send("matrix-data", matrix);
  }
});

ipcMain.on("determinant-result", (_event, result) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("determinant-result", result);
  }
});

ipcMain.on("close-child-windows", () => {
  if (object2Window && !object2Window.isDestroyed()) object2Window.close();
  if (object3Window && !object3Window.isDestroyed()) object3Window.close();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("windows-closed");
  }
});

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
