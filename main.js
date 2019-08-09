const { app, BrowserWindow } = require('electron');

let mainWindow = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadFile('index.html');
};

app.on('ready', createMainWindow);
