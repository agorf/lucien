const { app, BrowserWindow, dialog, Menu, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const process = require('process');

const manifest = require(path.join(app.getAppPath(), 'package.json'));

const appName = app.getName();
const appVersion = app.getVersion();

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

let editorWindow = null;
let editorWindowMenu = null;
let fileState = { ...initialFileState };
let defaultDialogPath = app.getPath('documents');

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
  editorWindowMenu.getMenuItemById('move-to-trash').enabled = Boolean(
    fileState.path
  );
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

const showSaveChangesDialog = ({
  onDiscard = () => {},
  onCancel = () => {},
  onSave = () => {}
} = {}) => {
  if (!fileState.isDirty) {
    // "Discard" non-existent changes
    onDiscard();
    return;
  }

  const dialogButtons = {
    Discard: 0,
    Cancel: 1,
    Save: 2
  };

  const clickedButton = dialog.showMessageBoxSync(editorWindow, {
    type: 'question',
    buttons: Object.keys(dialogButtons),
    defaultId: dialogButtons.Save,
    cancelId: dialogButtons.Cancel,
    title: 'Save changes?',
    message: 'Save changes before closing?'
  });

  switch (clickedButton) {
    case dialogButtons.Discard:
      onDiscard();
      return;

    case dialogButtons.Cancel:
      onCancel();
      return;

    case dialogButtons.Save:
      onSave();
      return;
  }
};

const openFile = filePath => {
  fs.readFile(filePath, (error, data) => {
    if (error) throw new Error(error);

    setFileState({
      path: filePath,
      data: data.toString().replace(/\n$/, ''),
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
  showSaveChangesDialog({
    onDiscard: openFileWithDialogUnsafe,
    onSave: () => {
      saveFileWithDialog()
        .then(openFileWithDialogUnsafe)
        .catch(error => {
          throw new Error(error);
        });
    }
  });
};

const saveFile = (path, data, callback = () => {}) => {
  // Append a new line character if missing
  if (data.slice(-1) !== '\n') data = `${data}\n`;

  fs.writeFile(path, data, callback);
};

const saveFileWithDialog = () => {
  return new Promise((resolve, reject) => {
    if (fileState.path) {
      saveFile(fileState.path, fileState.data, error => {
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

    saveFile(saveFilePath, fileState.data, error => {
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
  showSaveChangesDialog({
    onDiscard: newFileUnsafe,
    onSave: () => {
      saveFileWithDialog()
        .then(newFileUnsafe)
        .catch(error => {
          throw new Error(error);
        });
    }
  });
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

  let title = appName;

  if (fileState.path) {
    title = `${path.basename(fileState.path)} - ${title}`;
  }

  // TODO: Figure out a way to embed styles without duplicating their filenames
  // here and in editor.html styles. Until this happens, they most probably have
  // to be kept in sync.

  let styles = fs.readFileSync(
    path.join(
      app.getAppPath(),
      'node_modules/github-markdown-css/github-markdown.css'
    )
  );

  styles += fs.readFileSync(
    path.join(app.getAppPath(), 'node_modules/highlight.js/styles/github.css')
  );

  styles += fs.readFileSync(path.join(__dirname, 'style.css'));

  const htmlDataWrapped = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="generator" content="${appName} ${appVersion}">
<title>${title}</title>
<style>
${styles}
</style>
</head>
<body>
<div class="html-view markdown-body">
${htmlData}
</div>
</body>
</html>`;

  fs.writeFile(saveFilePath, htmlDataWrapped, error => {
    if (error) throw new Error(error);
  });
};

const moveFileToTrash = () => {
  const clickedButton = dialog.showMessageBoxSync(editorWindow, {
    type: 'question',
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
    title: 'Move file to trash?',
    message: 'This will delete the file and any unsaved changes. Are you sure?'
  });

  if (clickedButton === 1) return; // Canceled

  shell.moveItemToTrash(fileState.path);

  newFileUnsafe();
};

const showAboutDialog = () => {
  const clickedButton = dialog.showMessageBoxSync(editorWindow, {
    type: 'info',
    buttons: ['Visit website', 'Report issue', 'Close'],
    defaultId: 2,
    cancelId: 2,
    title: `About ${appName}`,
    message: appName,
    detail: [
      `Copyright © ${new Date().getFullYear()} ${manifest.author}`,
      '',
      `Licensed under the ${manifest.license} license`,
      '',
      `Version: ${appVersion}`,
      `Electron: ${process.versions.electron}`,
      `Node: ${process.versions.node}`,
      `V8: ${process.versions.v8}`,
      `Platform: ${process.platform}`,
      `Arch: ${process.arch}`
    ].join('\n')
  });

  switch (clickedButton) {
    case 0:
      shell.openExternal(manifest.homepage);
      break;

    case 1:
      shell.openExternal(manifest.bugs.url);
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
      {
        id: 'move-to-trash',
        label: 'Move to Trash',
        click: moveFileToTrash
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
    label: '&View',
    submenu: [
      {
        label: 'Toggle HTML preview',
        accelerator: 'CommandOrControl+Shift+H',
        click: () => editorWindow.webContents.send('toggle-html')
      },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'toggleDevTools' }
    ]
  },
  {
    label: '&Help',
    submenu: [
      {
        label: 'Markdown tutorial',
        click: () => {
          shell.openExternal(
            'https://github.com/agorf/lucien/blob/master/docs/markdown-tutorial.md'
          );
        }
      },
      { type: 'separator' },
      {
        label: 'Visit website',
        click: () => shell.openExternal(manifest.homepage)
      },
      {
        label: 'Report issue',
        click: () => shell.openExternal(manifest.bugs.url)
      },
      { type: 'separator' },
      {
        label: 'About',
        click: showAboutDialog
      }
    ]
  }
].filter(item => item); // Get rid of nulls

const handleAppReady = () => {
  editorWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  editorWindowMenu = Menu.buildFromTemplate(editorWindowMenuTemplate);
  editorWindow.setMenu(editorWindowMenu);

  updateWindowMenu();

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

  editorWindow.on('close', event => {
    showSaveChangesDialog({
      onCancel: () => event.preventDefault(),
      onSave: () => {
        event.preventDefault();

        saveFileWithDialog()
          .then(app.exit)
          .catch(error => {
            throw new Error(error);
          });
      }
    });
  });

  editorWindow.on('ready-to-show', editorWindow.show);
};

app.on('ready', handleAppReady);

module.exports = {
  exportAsHTMLFileWithDialog,
  openFile,
  saveFileWithDialog,
  setFileState,
  showSaveChangesDialog
};
