const { app, BrowserWindow, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow = null;

const openFile = filePath => {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    mainWindow.webContents.send('file-opened', {
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
      filters: [
        {
          name: 'Markdown Files',
          extensions: ['md', 'mkd', 'mdown', 'markdown']
        },
        { name: 'Text Files', extensions: ['txt', 'text'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    .then(({ canceled, filePaths }) => {
      if (canceled) return;

      openFile(filePaths[0]);
    })
    .catch(console.log);
};

exports.saveFile = (filePath, data) => {
  fs.writeFile(filePath, data, error => {
    if (error) {
      console.log(error);
      return;
    }
  });
};

const appMenuTemplate = [
  {
    label: 'File',
    submenu: [
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
