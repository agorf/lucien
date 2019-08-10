const { app, BrowserWindow, dialog, Menu, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const openAboutWindow = require('about-window').default;

const appName = app.getName();

let editorWindow = null;
let editorWindowMenu = null;
let openFilePath = null;
let isFileDirty = false;

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
    const dirtyPrefix = isFileDirty ? '• ' : '';
    title = `${dirtyPrefix}${path.basename(openFilePath)} - ${title}`;
  }

  editorWindow.setTitle(title);
};

const updateWindowMenu = () => {
  editorWindowMenu.getMenuItemById('save').enabled = isFileDirty;
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

const shouldDiscardChanges = () => {
  return (
    !isFileDirty ||
    dialog.showMessageBoxSync(editorWindow, {
      type: 'question',
      buttons: ['OK', 'Cancel'],
      defaultId: 1,
      title: 'Discard changes?',
      message: 'This will discard current changes. Are you sure?',
      cancelId: 1
    }) === 0
  );
};

const openFile = filePath => {
  fs.readFile(filePath, (error, data) => {
    if (error) throw new Error(error);

    setOpenFilePath(filePath);
    setIsFileDirty(false);

    editorWindow.webContents.send('open-file', data.toString());
  });
};

const openFileWithDialog = () => {
  if (!shouldDiscardChanges()) return;

  dialog
    .showOpenDialog(editorWindow, {
      title: 'Open Markdown file',
      defaultPath: app.getPath('documents'),
      properties: ['openFile'],
      filters: dialogFilters
    })
    .then(({ canceled, filePaths }) => {
      if (canceled) return;

      openFile(filePaths[0]);
    })
    .catch(error => {
      throw new Error(error);
    });
};

const saveFile = (filePath, data) => {
  fs.writeFile(filePath, data, error => {
    if (error) throw new Error(error);

    setOpenFilePath(filePath);
    setIsFileDirty(false);
  });
};

const saveFileWithDialog = (filePath, data) => {
  if (filePath) {
    saveFile(filePath, data);
    return;
  }

  // Saving a new file
  dialog
    .showSaveDialog(editorWindow, {
      title: 'Save Markdown file',
      defaultPath: app.getPath('documents'),
      filters: dialogFilters
    })
    .then(({ canceled, filePath }) => {
      if (canceled) return;

      saveFile(filePath, data);
    })
    .catch(error => {
      throw new Error(error);
    });
};

const newFile = () => {
  if (!shouldDiscardChanges()) return;

  setOpenFilePath(null);
  setIsFileDirty(false);

  editorWindow.webContents.send('new-file');
};

const editorWindowMenuTemplate = [
  {
    label: '&File',
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
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click: app.quit
      }
    ]
  },
  { label: '&Edit', role: 'editMenu' },
  { label: '&View', role: 'viewMenu' },
  {
    label: '&Help',
    submenu: [
      {
        label: 'Markdown spec',
        click: () => {
          shell.openExternal('https://github.github.com/gfm/');
        }
      },
      { type: 'separator' },
      {
        label: 'About',
        click: () => {
          openAboutWindow({
            icon_path: path.join(__dirname, 'icon.png'),
            copyright: `Copyright © ${new Date().getFullYear()} Angelos Orfanakos`,
            win_options: {
              parent: editorWindow,
              modal: true
            },
            adjust_window_size: true,
            use_version_info: false,
            show_close_button: 'Close'
          });
        }
      }
    ]
  }
];

const handleAppReady = () => {
  editorWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  editorWindowMenu = Menu.buildFromTemplate(editorWindowMenuTemplate);
  editorWindow.setMenu(editorWindowMenu);

  editorWindow
    .loadFile(path.join(__dirname, 'editor.html'))
    .then(() => {
      editorWindow.on('resize', () => {
        editorWindow.webContents.send(
          'window-resize',
          editorWindow.getBounds()
        );
      });
    })
    .catch(error => {
      throw new Error(error);
    });

  editorWindow.on('ready-to-show', editorWindow.show);
};

app.on('ready', handleAppReady);

app.on('before-quit', event => {
  // Do not ask for confirmation to discard changes if the window has been
  // force-closed because we cannot reopen it again.
  // TODO: Ask for confirmation to save changes before quitting instead.
  if (!editorWindow.isVisible()) return;

  if (!shouldDiscardChanges()) event.preventDefault();
});

module.exports = {
  console,
  saveFileWithDialog,
  setIsFileDirty
};
