const { app, BrowserWindow, dialog, Menu, shell } = require('electron');
const readPackageJSON = require('read-package-json');
const fs = require('fs');
const path = require('path');
const process = require('process');

const appName = app.getName();

const initialFileState = {
  path: null,
  data: '',
  isDirty: false
};

const dialogFilters = [
  {
    name: 'Markdown Files',
    extensions: ['md', 'mkd', 'mdown', 'markdown']
  },
  { name: 'Text Files', extensions: ['txt', 'text'] },
  { name: 'All Files', extensions: ['*'] }
];

const saveChangesDialogButtons = {
  Discard: 0,
  Cancel: 1,
  Save: 2
};

let editorWindow = null;
let editorWindowMenu = null;
let fileState = { ...initialFileState };
let defaultDialogPath = app.getPath('documents');
let packageJSON = {};

readPackageJSON(path.join(app.getAppPath(), 'package.json'), (error, data) => {
  if (error) throw new Error(error);

  packageJSON = data;
});

// Clean up command-line arguments
const argv = [...process.argv];
argv.shift();
if (!app.isPackaged) argv.shift(); // Drop path in development

const updateWindowTitle = () => {
  let title = appName;

  if (fileState.path) {
    title = `${path.basename(fileState.path)} - ${title}`;
  }

  if (fileState.isDirty) {
    title = `${title} (Unsaved changes)`;
  }

  editorWindow.setTitle(title);
};

const updateWindowMenu = () => {
  editorWindowMenu.getMenuItemById('save').enabled = fileState.isDirty;
  editorWindowMenu.getMenuItemById('export-as-html').enabled =
    fileState.data.length > 0;
};

const setFileState = newState => {
  fileState = { ...fileState, ...newState };

  if (newState.path !== undefined || newState.isDirty !== undefined) {
    updateWindowTitle();
  }

  if (newState.data !== undefined || newState.isDirty !== undefined) {
    updateWindowMenu();
  }

  if (newState.path !== undefined && newState.path !== null) {
    defaultDialogPath = path.dirname(newState.path);
  }

  return fileState;
};

const showSaveChangesDialog = () => {
  if (!fileState.isDirty) return 0; // "Discard" non-existent changes

  return dialog.showMessageBoxSync(editorWindow, {
    type: 'question',
    buttons: Object.keys(saveChangesDialogButtons),
    defaultId: saveChangesDialogButtons.Save,
    cancelId: saveChangesDialogButtons.Cancel,
    title: 'Save changes?',
    message: 'Save changes before closing?'
  });
};

const openFile = filePath => {
  fs.readFile(filePath, (error, data) => {
    if (error) throw new Error(error);

    setFileState({
      path: filePath,
      data: data.toString(),
      isDirty: false
    });

    editorWindow.webContents.send('open-file', fileState.data);
  });
};

// Discards changes!
const openFileWithDialogUnsafe = () => {
  const [filePath] =
    dialog.showOpenDialogSync(editorWindow, {
      title: 'Open Markdown file',
      defaultPath: defaultDialogPath,
      properties: ['openFile'],
      filters: dialogFilters
    }) || [];

  if (!filePath) return; // Canceled

  openFile(filePath);
};

const openFileWithDialog = () => {
  switch (showSaveChangesDialog()) {
    case saveChangesDialogButtons.Discard:
      openFileWithDialogUnsafe();
      return;

    case saveChangesDialogButtons.Cancel:
      return;

    case saveChangesDialogButtons.Save:
      saveFileWithDialog()
        .then(openFileWithDialogUnsafe)
        .catch(error => {
          throw new Error(error);
        });
      return;
  }
};

const saveFileWithDialog = () => {
  return new Promise((resolve, reject) => {
    if (fileState.path) {
      fs.writeFile(fileState.path, fileState.data, error => {
        if (error) {
          reject(error);
        } else {
          setFileState({ isDirty: false });
          resolve();
        }
      });
      return;
    }

    const saveFilePath = dialog.showSaveDialogSync(editorWindow, {
      title: 'Save Markdown file',
      defaultPath: defaultDialogPath,
      filters: dialogFilters
    });

    if (!saveFilePath) return; // Canceled

    fs.writeFile(saveFilePath, fileState.data, error => {
      if (error) {
        reject(error);
      } else {
        setFileState({
          path: saveFilePath,
          isDirty: false
        });
        resolve();
      }
    });
  });
};

// Discards changes!
const newFileUnsafe = () => {
  setFileState(initialFileState);

  editorWindow.webContents.send('new-file');
};

const newFile = () => {
  switch (showSaveChangesDialog()) {
    case saveChangesDialogButtons.Discard:
      newFileUnsafe();
      return;

    case saveChangesDialogButtons.Cancel:
      return;

    case saveChangesDialogButtons.Save:
      saveFileWithDialog()
        .then(newFileUnsafe)
        .catch(error => {
          throw new Error(error);
        });
      return;
  }
};

const exportAsHTMLFileWithDialog = htmlData => {
  const saveFilePath = dialog.showSaveDialogSync(editorWindow, {
    title: 'Export Markdown file as HTML',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html', 'htm'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!saveFilePath) return; // Canceled

  fs.writeFile(saveFilePath, htmlData, error => {
    if (error) throw new Error(error);
  });
};

const showAboutDialog = () => {
  const message = `${appName} ${app.getVersion()}

Copyright © ${new Date().getFullYear()} Angelos Orfanakos

Licensed under the ${packageJSON.license} license`;

  const clickedButton = dialog.showMessageBoxSync(editorWindow, {
    type: 'info',
    buttons: ['Visit website', 'Report issue', 'Close'],
    defaultId: 2,
    cancelId: 2,
    title: `About ${appName}`,
    message
  });

  switch (clickedButton) {
    case 0:
      shell.openExternal(packageJSON.homepage);
      break;

    case 1:
      shell.openExternal(packageJSON.bugs.url);
      break;
  }
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
        click: saveFileWithDialog
      },
      { type: 'separator' },
      {
        id: 'export-as-html',
        label: 'Export as HTML',
        click: () => editorWindow.webContents.send('export-as-html')
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
  {
    label: '&Help',
    submenu: [
      {
        label: 'Markdown tutorial',
        click: () => {
          shell.openExternal(
            'https://github.com/agorf/lucien/blob/master/markdown-tutorial.md'
          );
        }
      },
      { type: 'separator' },
      {
        label: 'Visit website',
        click: () => shell.openExternal(packageJSON.homepage)
      },
      {
        label: 'Report issue',
        click: () => shell.openExternal(packageJSON.bugs.url)
      },
      { type: 'separator' },
      {
        label: 'About',
        click: showAboutDialog
      }
    ]
  }
];

if (!app.isPackaged) {
  editorWindowMenuTemplate.splice(-1, 0, { label: '&View', role: 'viewMenu' });
}

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
      if (argv.length === 1) {
        openFile(argv[0]);
      }

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

const handleAppBeforeQuit = event => {
  // Do not ask for confirmation to discard changes if the window has been
  // force-closed because we cannot reopen it again.
  // TODO: Ask for confirmation to save or discard changes before quitting
  // instead.
  if (!editorWindow.isVisible()) return;

  switch (showSaveChangesDialog()) {
    case saveChangesDialogButtons.Discard:
      return;

    case saveChangesDialogButtons.Cancel:
      event.preventDefault();
      return;

    case saveChangesDialogButtons.Save:
      event.preventDefault();

      saveFileWithDialog()
        .then(app.exit)
        .catch(error => {
          throw new Error(error);
        });

      return;
  }
};

app.on('ready', handleAppReady);

app.on('before-quit', handleAppBeforeQuit);

module.exports = {
  console,
  exportAsHTMLFileWithDialog,
  setFileState
};
