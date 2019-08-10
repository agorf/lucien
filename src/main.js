const { app, BrowserWindow, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let editorWindow = null;
let openFilePath = null;
let isFileDirty = false;
const appName = 'Lucien';

const dialogFilters = [
  {
    name: 'Markdown Files',
    extensions: ['md', 'mkd', 'mdown', 'markdown']
  },
  { name: 'Text Files', extensions: ['txt', 'text'] },
  { name: 'All Files', extensions: ['*'] }
];

const updateWindowTitle = () => {
  let title = appName;

  if (openFilePath) {
    title = `${isFileDirty ? '• ' : ''}${path.basename(
      openFilePath
    )} - ${title}`;
  }

  editorWindow.setTitle(title);
};

const updateWindowMenu = () => {
  Menu.getApplicationMenu().getMenuItemById('save').enabled = isFileDirty;
};

const setOpenFilePath = value => {
  openFilePath = value;

  updateWindowTitle();
};

const setIsFileDirty = value => {
  isFileDirty = value;

  updateWindowTitle();
  updateWindowMenu();
};

const openFile = filePath => {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    setOpenFilePath(filePath);
    setIsFileDirty(false);

    editorWindow.webContents.send('open-file', data.toString());
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

    setOpenFilePath(filePath);
    setIsFileDirty(false);
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
  setOpenFilePath(null);

  editorWindow.webContents.send('new-file');
};

exports.markFileDirty = () => {
  setIsFileDirty(true);
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
        id: 'save',
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => editorWindow.webContents.send('save-file', openFilePath)
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

  editorWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  editorWindow
    .loadFile(path.resolve(__dirname, 'editor.html'))
    .then(() => {
      editorWindow.webContents.send('window-resize', editorWindow.getBounds());

      editorWindow.on('resize', () => {
        editorWindow.webContents.send(
          'window-resize',
          editorWindow.getBounds()
        );
      });
    })
    .catch(console.log);
};

app.on('ready', handleAppReady);
