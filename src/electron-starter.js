const { app, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');
const url = require('url');
const path = require('path'); 
const afs = require('fs').promises;
const cheerio = require('cheerio-httpcli');
const AccountListPath = './src/TempData/AccountList.json';
const LinkageListPath = './src/TempData/AccountLinkage.json';

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

ipcMain.handle('side/getGroupList', groupMain.getGroupList);
ipcMain.handle('side/createGroup', (event, newGroupName) => groupMain.createGroup(event, newGroupName));
ipcMain.handle('side/updateGroup', (event, updateGroupData) => groupMain.updateGroup(event, updateGroupData));
ipcMain.handle('side/removeGroup', (event, id) => groupMain.removeGroup(event, id));

ipcMain.handle('main/getAccount', async () => {
  try {
    const AccountLinkage = await afs.readFile(LinkageListPath);
    const AccountList = await afs.readFile(AccountListPath);
    const { list } = JSON.parse(AccountList);
    const { linkList } = JSON.parse(AccountLinkage);
    const result = {
      success: true,
      code: 1,
      accountData: list,
      linkData: linkList,
    };

    return result;
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    };

    return result;
  }
});

ipcMain.handle('main/getAccountDetail', async (event, id) => {
  try {
    const AccountList = await afs.readFile(AccountListPath);
    const { list } = JSON.parse(AccountList);
    const detailData = list.filter((v) => v.id === id)[0];
    const result = {
      success: true,
      code: 1,
      data: detailData,
    };

    return result;
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    };

    return result;
  }
});

ipcMain.handle('main/createAccount', async (event, newAccountData) => {
  const { siteUrl, protocol } = newAccountData;
  const url = protocol + siteUrl;

  const faviconLocation = await cheerio.fetch(url)
    .then((result) => {
      const { $ } = result;
      const { href } = $('link[rel="shortcut icon"]')[0].attribs
        || $('link[rel="icon"]')[0].attribs
        || $('link[rel="apple-touch-icon"]')[0].attribs
        || $('link[rel="apple-touch-icon-precomposed"]')[0].attribs;

      return href.match('http') || href.match('com') ? href : url + href;
    })
    .catch((error) => {
      console.log(error.message);
    });
  
  try {
    const accountList = await afs.readFile(AccountListPath);
    const { sequence, list }  = JSON.parse(accountList);
    const newAccountList = {
      sequence: sequence + 1,
      list: list.concat(
        {
          ...newAccountData,
          siteUrl: url,
          siteIcon: faviconLocation,
          id: sequence + 1
        }
      )
    };
      
    afs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8')
    const result = {
      success: true,
      code: 1,
      accountData: newAccountList.list,
      log: '성공적으로 등록했어요.',
    };

    return result;
  } catch (error) {
    const result = {
      success: true,
      code: 2,
      log: error.message
    };

    return result;
  }
});

ipcMain.handle('main/removeAccount', async (event, id) => {
  try {
    const AccountList = await afs.readFile(AccountListPath);

    const { sequence, list } = JSON.parse(AccountList);
    const newAccountList = {
      sequence,
      list: list.filter((v) => v.id !== id),
    }

    afs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8');

    const result = {
      success: true,
      code: 1,
      accountData: newAccountList.list,
      log: '성공적으로 삭제했어요.',
    };

    return result;
  } catch(error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    };

    return result;
  }
});

ipcMain.handle('main/updateAccount', async (event, accountData) => {
  try {
    const { siteNameKr, siteNameEng, protocol, siteUrl, accountId, accountPwd, id } = accountData;
    const url = protocol + siteUrl;
    const AccountList = await afs.readFile(AccountListPath);
    const { sequence, list } = JSON.parse(AccountList);
    const newAccountDataList = {
      sequence,
      list: list.map((v) => v.id === id
            ? { ...v, siteNameKr, siteNameEng, url, accountId, accountPwd }
            : { ...v })
    };

    afs.writeFile(AccountListPath, JSON.stringify(newAccountDataList), 'utf8');

    const result = {
      success: true,
      code: 1,
      accountData: newAccountDataList.list,
      log: '성공적으로 수정했어요.',
    };

    return result;
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    };

    return result;
  } 
});

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