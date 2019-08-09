const { app, BrowserWindow, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow = null;

const dialogFilters = [
  {
    name: 'Markdown Files',
    extensions: ['md', 'mkd', 'mdown', 'markdown']
  },
  { name: 'Text Files', extensions: ['txt', 'text'] },
  { name: 'All Files', extensions: ['*'] }
];

const openFile = filePath => {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    mainWindow.webContents.send('open-file', {
      path: filePath,
      data: data.toString()
    });
  });
};

const openFileWithDialog = () => {
  dialog
    .showOpenDialog({
      title: 'Open Markdown file',
      defaultPath: app.getPath('documents'),
      properties: ['openFile'],
      filters: dialogFilters
    })
    .then(({ canceled, filePaths }) => {
      if (canceled) return;

      openFile(filePaths[0]);
    })
    .catch(console.log);
};

const saveFile = (filePath, data) => {
  fs.writeFile(filePath, data, error => {
    if (error) {
      console.log(error);
      return;
    }
  });
};

exports.saveFileWithDialog = (filePath, data) => {
  if (filePath) {
    saveFile(filePath, data);
    return;
  }

  // Saving a new file
  dialog
    .showSaveDialog({
      title: 'Save Markdown file',
      defaultPath: app.getPath('documents'),
      filters: dialogFilters
    })
    .then(({ canceled, filePath }) => {
      if (canceled) return;

      saveFile(filePath, data);
    })
    .catch(console.log);
};

const newFile = () => {
  mainWindow.webContents.send('new-file');
};

const appMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CommandOrControl+N',
        click: newFile
      },
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
        click: openFileWithDialog
      },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => mainWindow.webContents.send('save-file')
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click: app.quit
      }
    ]
  },
  {
    label: 'Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        role: 'toggleDevTools'
      }
    ]
  }
];

const handleAppReady = () => {
  const appMenu = Menu.buildFromTemplate(appMenuTemplate);
  Menu.setApplicationMenu(appMenu);

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile(path.resolve(__dirname, 'editor.html'));
};

app.on('ready', handleAppReady);
