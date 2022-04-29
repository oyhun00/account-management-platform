const {
  app, BrowserWindow, ipcMain, Tray, Menu,
} = require('electron');
const url = require('url');
const path = require('path');
const { checkExists } = require('./util/fsModule');

let tray = null;

const initTray = (win) => {
  tray = new Tray(path.join(__dirname, '/../assets/favicon.ico'));

  const contextMenu = Menu.buildFromTemplate([
    { label: '열기', type: 'normal', click: () => win.show() },
    {
      label: '종료',
      type: 'normal',
      click: () => {
        app.quitting = true;
        app.quit();
      },
    },
  ]);

  tray.on('double-click', () => win.show());
  tray.setToolTip('amp');
  tray.setContextMenu(contextMenu);
};

const createWindow = () => {
  let win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}//preload.js`,
      webSecurity: false,
    },
    center: true,
  });

  const startUrl = win.loadURL(url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  checkExists();

  if (!app.requestSingleInstanceLock()) {
    app.quit();
    tray.destroy();
    win = null;
  } else {
    app.on('second-instance', () => {
      if (win) {
        if (win.isMinimized() || !win.isVisible()) { win.show(); }
        win.focus();
      }
    });
  }

  initTray(win);

  win.on('close', (event) => {
    if (app.quitting) { win = null; } else {
      event.preventDefault();
      win.hide();
    }
  });
  win.loadURL(startUrl);
  win.setMenu(null);
};

app.whenReady().then(() => {
  createWindow();
});

const groupMain = require('../server/GroupMain');
const accountMain = require('../server/AccountMain');
const linkedAccountMain = require('../server/LinkedAccountMain');

ipcMain.handle('side/getGroupList', groupMain.getGroupList);
ipcMain.handle('side/getFirstGroup', groupMain.getFirstGroup);
ipcMain.handle('side/createGroup', (event, newGroupName) => groupMain.createGroup(event, newGroupName));
ipcMain.handle('side/updateGroup', (event, updateGroupData) => groupMain.updateGroup(event, updateGroupData));
ipcMain.handle('side/removeGroup', (event, id) => groupMain.removeGroup(event, id));

ipcMain.handle('main/getIconPath', accountMain.getIconPath);
ipcMain.handle('main/getAccount', accountMain.getAccount);
ipcMain.handle('main/getAccountDetail', (event, id) => accountMain.getAccountDetail(event, id));
ipcMain.handle('main/createAccount', (event, newAccountData) => accountMain.createAccount(event, newAccountData));
ipcMain.handle('main/removeAccount', (event, id) => accountMain.removeAccount(event, id));
ipcMain.handle('main/updateAccount', (event, accountData) => accountMain.updateAccount(event, accountData));

ipcMain.handle('link/getIconPath', linkedAccountMain.getIconPath);
ipcMain.handle('link/getAccount', linkedAccountMain.getAccount);
ipcMain.handle('link/getAccountDetail', (event, id) => linkedAccountMain.getAccountDetail(event, id));
ipcMain.handle('link/createAccount', (event, newAccountData) => linkedAccountMain.createAccount(event, newAccountData));
ipcMain.handle('link/removeAccount', (event, id) => linkedAccountMain.removeAccount(event, id));
ipcMain.handle('link/updateAccount', (event, accountData) => linkedAccountMain.updateAccount(event, accountData));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow(); }
});
