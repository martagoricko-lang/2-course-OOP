const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronIPC", {
  startAndGenerate: (params) => ipcRenderer.send("start-and-generate", params),
  sendMatrixData: (matrix) => ipcRenderer.send("matrix-data", matrix),
  sendDeterminantResult: (result) =>
    ipcRenderer.send("determinant-result", result),
  closeChildWindows: () => ipcRenderer.send("close-child-windows"),

  onGenerateMatrix: (callback) => {
    ipcRenderer.removeAllListeners("generate-matrix");
    ipcRenderer.on("generate-matrix", (_event, params) => callback(params));
  },
  onMatrixData: (callback) => {
    ipcRenderer.removeAllListeners("matrix-data");
    ipcRenderer.on("matrix-data", (_event, matrix) => callback(matrix));
  },
  onDeterminantResult: (callback) => {
    ipcRenderer.removeAllListeners("determinant-result");
    ipcRenderer.on("determinant-result", (_event, result) => callback(result));
  },
  onWindowsClosed: (callback) => {
    ipcRenderer.removeAllListeners("windows-closed");
    ipcRenderer.on("windows-closed", () => callback());
  },
});
