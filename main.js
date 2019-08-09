const { app, BrowserWindow, Menu } = require('electron');

let mainWindow = null;

const appMenuTemplate = [
  {
    label: 'File',
    submenu: [
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

  mainWindow = new BrowserWindow();
  mainWindow.loadFile('editor.html');
};

app.on('ready', handleAppReady);
