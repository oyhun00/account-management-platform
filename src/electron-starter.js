const { app, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');
const os = require('os');
const url = require('url');
const path = require('path'); 
const fs = require('fs');
const afs = require('fs').promises;
const cheerio = require('cheerio-httpcli');
const MenuListPath = './src/TempData/MenuList.json';
const AccountListPath = './src/TempData/AccountList.json';
const LinkageListPath = './src/TempData/AccountLinkage.json';

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    autoHideMenuBar: true,
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

ipcMain.on('main/getFavicon', (event, crawlUrl) => {
  cheerio.fetch(crawlUrl)
    .then((res) => {
      const { $ } = res;
      const { href } = $('link[rel="shortcut icon"]')[0].attribs || $('link[rel="apple-touch-icon-precomposed"]')[0].attribs;
      const faviconLocation = href.match('http') || href.match('https') ? href : crawlUrl + href;

      event.sender.send('main/getFavicon', faviconLocation);
    })
});

ipcMain.handle('side/getGroupList', async (event) => {
  try { 
    const MenuList = await afs.readFile(MenuListPath);
    const { list } = JSON.parse(MenuList);
    const result = {
      success: true,
      code: 1,
      data: list,
    };

    return result;
  } catch(error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    }

    return result;
  }
});

ipcMain.handle('side/createGroup', async (event, newMenuName) => {
  try {
    const MenuList = await afs.readFile(MenuListPath);
    const { list, sequence }  = JSON.parse(MenuList);
    const _sequence = sequence + 1;
    const newMenuList = {
      sequence: _sequence,
      list: list.concat({
        id: _sequence,
        menuName: newMenuName,
        menuIndex: _sequence,
        updateStatus: false
      })
    };

    afs.writeFile(MenuListPath, JSON.stringify(newMenuList), 'utf8');
    const result = {
      success: true,
      code: 1,
      data: newMenuList.list,
      log: '성공적으로 등록했어요!',
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

ipcMain.handle('side/updateGroup', async (event, updateMenuData) => {
  try {
    const MenuList = await afs.readFile(MenuListPath);
    const { sequence } = JSON.parse(MenuList);
    const updateMenuList = {
      sequence,
      list: updateMenuData,
    };

    afs.writeFile(MenuListPath, JSON.stringify(updateMenuList), 'utf8');

    const result = {
      success: true,
      code: 1,
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
})

ipcMain.handle('side/removeGroup', async (event, id) => {
  try {
    const MenuList = await afs.readFile(MenuListPath);
    const parseMenuList = JSON.parse(MenuList);
    const newMenuList = {
      sequence : parseMenuList.sequence,
      list: parseMenuList.list.filter((v) => v.id !== id),
    };

    const AccountList = await afs.readFile(AccountListPath);
    const parseAccountList = JSON.parse(AccountList);
    const filteredAccount = {
      sequence : parseAccountList.sequence,
      list: parseAccountList.list.filter((v) => v.group !== id)
    };

    afs.writeFile(AccountListPath, JSON.stringify(filteredAccount), 'utf8');
    afs.writeFile(MenuListPath, JSON.stringify(newMenuList), 'utf8');

    const result = {
      success: true,
      code: 1,
      data: newMenuList.list,
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
  
  const _cheerio = await cheerio.fetch(url);
  const { $ } = _cheerio;
  const { href } = $('link[rel="shortcut icon"]')[0].attribs
    || $('link[rel="icon"]')[0].attribs
    || $('link[rel="apple-touch-icon"]')[0].attribs
    || $('link[rel="apple-touch-icon-precomposed"]')[0].attribs;
  const faviconLocation = href.match('http') || href.match('com') ? href : url + href;

  try {
    const accountList = await afs.readFile(AccountListPath);
    const { sequence, list } = JSON.parse(accountList);
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
      success: false,
      code: 2,
      log: error.message,
    };
    
    return result;
  } 
  

  // cheerio.fetch(url)
  //   .then((result) => {
  //     const { $ } = result;
  //     const { href } = $('link[rel="shortcut icon"]')[0].attribs
  //       || $('link[rel="icon"]')[0].attribs
  //       || $('link[rel="apple-touch-icon"]')[0].attribs
  //       || $('link[rel="apple-touch-icon-precomposed"]')[0].attribs;

  //     return href;
  //   })
  //   .catch(error => {
  //     const result = {
  //       success: false,
  //       code: 2,
  //       log: error,
  //     };
      
  //     return result;
  //   })
  //   .then((href) => {
  //     if (href) {
  //       return href.match('http') || href.match('com') ? href : url + href;
  //     } else {
  //       return false;
  //     }
  //   })
  //   .then((faviconLocation) => {
  //     fs.readFile(AccountListPath, 'utf8', (error, prevAccountData) => {
  //       if (error) {
  //         const result = {
  //           success: false,
  //           code: 2,
  //           log: error,
  //         };
          
  //         return result;
  //       } 
        
  //       const { sequence, list } = JSON.parse(prevAccountData);
  //       const _sequence = sequence + 1;
  //       const newAccountList = {
  //         sequence: _sequence,
  //         list: list.concat(
  //           {
  //             ...newAccountData,
  //             siteUrl: url,
  //             siteIcon: faviconLocation,
  //             id: _sequence
  //           }
  //         )
  //       };
      
  //       fs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8', (error) => {
  //         const result = {
  //           success: true,
  //           code: 1,
  //           accountData: newAccountList.list,
  //           log: '성공적으로 등록했어요.',
  //         };
          
  //         return result;
  //       });
  //     });
  //   });
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
    event.sender.send('main/getAccount', {
      success: false,
      code: 2,
      log: error.message,
    });

    return;
  }
});

ipcMain.on('main/updateAccount', async (event, accountData) => {
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

    afs.writeFile(AccountListPath, JSON.stringify(newAccountDataList), 'utf8')
      .then(() => {
        const { list } = newAccountDataList;

        event.sender.send('main/getAccount', {
          success: true,
          code: 1,
          accountData: list,
          log: '성공적으로 수정했어요.',
        });
      });
  } catch (error) {
    event.sender.send('main/getAccount', {
      success: false,
      code: 2,
      log: error.message,
    });

    return;
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