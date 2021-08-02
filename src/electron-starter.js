const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path'); 

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    autoHideGroupBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '//preload.js'
    },
  })

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

const groupMain = require('../server/GroupMain');
const accountMain = require('../server/AccountMain');

ipcMain.handle('side/getGroupList', groupMain.getGroupList);
ipcMain.handle('side/createGroup', (event, newGroupName) => groupMain.createGroup(event, newGroupName));
ipcMain.handle('side/updateGroup', (event, updateGroupData) => groupMain.updateGroup(event, updateGroupData));
ipcMain.handle('side/removeGroup', (event, id) => groupMain.removeGroup(event, id));

ipcMain.handle('main/getAccount', accountMain.getAccount);
ipcMain.handle('main/getAccountDetail', (event, id) => accountMain.getAccountDetail(event, id));
ipcMain.handle('main/createAccount', (event, newAccountData) => accountMain.createAccount(event, newAccountData));
ipcMain.handle('main/removeAccount', (event, id) => accountMain.removeAccount(event, id));
ipcMain.handle('main/updateAccount', (event, accountData) => accountMain.updateAccount(event, accountData));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})