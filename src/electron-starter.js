const { app, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');
const url = require('url');
const path = require('path'); 
const fs = require('fs');
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
      preload: __dirname + '\\preload.js'
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

ipcMain.on('side/getMenuList', (event, arg) => {
  fs.readFile(MenuListPath, 'utf8', (error, data) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }

    const { list } = JSON.parse(data);

    event.sender.send('side/getMenuList', {
      success: true,
      code: 1,
      data: list,
    });
  })
});

ipcMain.on('side/createMenu', (event, newMenuName) => {
  fs.readFile(MenuListPath, 'utf8', (error, data) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }
    
    const { list, sequence } = JSON.parse(data);
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

    fs.writeFile(MenuListPath, JSON.stringify(newMenuList), 'utf8', (error) => {
      if (error) {
        event.sender.send('side/getMenuList', {
          success: false,
          code: 2,
          log: error,
        });
  
        return;
      }

      const { list } = newMenuList;

      event.sender.send('side/getMenuList', {
        success: true,
        code: 1,
        data: list,
        log: '성공적으로 등록했어요!',
      });
    });
  });
});

ipcMain.on('side/updateMenu', (event, updateMenuData) => {
  fs.readFile(MenuListPath, 'utf8', (error, prevMenuData) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }
    
    const { sequence } = JSON.parse(prevMenuData);

    const updateMenuList = {
      sequence,
      list: updateMenuData,
    };

    fs.writeFile(MenuListPath, JSON.stringify(updateMenuList), 'utf8', (error) => {
      if (error) {
        event.sender.send('side/getMenuList', {
          success: false,
          code: 2,
          log: error,
        });

        return;
      }
    });
  });
})

ipcMain.on('side/removeMenu', (event, id) => {
  fs.readFile(MenuListPath, 'utf8', (error, data) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }
    
    const { sequence, list } = JSON.parse(data);
    const newMenuList = {
      sequence,
      list: list.filter((v) => v.id !== id),
    }

    fs.readFile(AccountListPath, 'utf8', (error, data) => {
      if (error) {
        event.sender.send('main/getAccount', {
          success: false,
          code: 2,
          log: error,
        });
  
        return;
      }
      
      const { sequence, list } = JSON.parse(data);
      const filteredAccount = {
        sequence,
        list: list.filter((v) => v.group !== id)
      }

      fs.writeFile(AccountListPath, JSON.stringify(filteredAccount), 'utf8', (error) => {
        const { list } = filteredAccount;
  
        event.sender.send('main/getAccount', {
          success: true,
          code: 1,
          data: list,
        });
      });
    });
    
    fs.writeFile(MenuListPath, JSON.stringify(newMenuList), 'utf8', (error) => {
      const { list } = newMenuList;

      event.sender.send('side/getMenuList', {
        success: true,
        code: 1,
        data: list,
        log: '성공적으로 삭제했어요.',
      });
    });
  });
});


ipcMain.on('main/getAccount', (event, id) => {
  const AccountLinkage = fs.readFileSync(LinkageListPath);

  fs.readFile(AccountListPath, 'utf8', (error, data) => {
    if (error) {
      event.sender.send('main/getAccount', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }
    
    const { list } = JSON.parse(data);

    event.sender.send('main/getAccount', {
      success: true,
      code: 1,
      data: list,
      link : JSON.parse(AccountLinkage),
    });
  });
});

ipcMain.on('main/getAccountDetail', (event, id) => {
  fs.readFile(AccountListPath, 'utf8', (error, data) => {
    if (error) {
      event.sender.send('main/getAccountDetail', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }
    
    const { list } = JSON.parse(data);
    const detailData = list.filter((v) => v.id === id)[0];

    event.sender.send('main/getAccountDetail', {
      success: true,
      code: 1,
      data: detailData,
    });
  });
});

ipcMain.on('main/createAccount', (event, newAccountData) => {
  const { siteUrl, protocol } = newAccountData;
  const url = protocol + siteUrl;

  cheerio.fetch(url)
    .then((result) => {
      const { $ } = result;
      const { href } = $('link[rel="shortcut icon"]')[0].attribs
        || $('link[rel="icon"]')[0].attribs
        || $('link[rel="apple-touch-icon"]')[0].attribs
        || $('link[rel="apple-touch-icon-precomposed"]')[0].attribs;

      return href;
    })
    .catch(error => {
      event.sender.send('main/getAccount', {
        success: false,
        code: 3,
        log: 'URL이 유효하지 않아 파비콘을 파싱하지 못했습니다.',
      });

      log.info('err : ' + error);
    })
    .then((href) => {
      if (href) {
        return href.match('http') || href.match('com') ? href : url + href;
      } else {
        return false;
      }
    })
    .then((faviconLocation) => {
      fs.readFile(AccountListPath, 'utf8', (error, prevAccountData) => {
        if (error) {
          event.sender.send('main/getAccount', {
            success: false,
            code: 2,
            log: error,
          });
          return;
        } 
        
        const { sequence, list } = JSON.parse(prevAccountData);
        const _sequence = sequence + 1;
        const newAccountList = {
          sequence: _sequence,
          list: list.concat(
            {
              ...newAccountData,
              siteUrl: url,
              siteIcon: faviconLocation,
              id: _sequence
            }
          )
        };
      
        fs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8', (error) => {
          const { list } = newAccountList;
    
          event.sender.send('main/getAccount', {
            success: true,
            code: 1,
            data: list,
            log: '성공적으로 등록했어요.',
          });
        });
      });
    })
});

ipcMain.on('main/removeAccount', (event, id) => {
  fs.readFile(AccountListPath, 'utf8', (error, prevAccountData) => {
    if (error) {
      event.sender.send('main/getAccount', {
        success: false,
        code: 2,
        log: error,
      });
      return;
    } 
    const { sequence, list } = JSON.parse(prevAccountData);
    const newAccountList = {
      sequence,
      list: list.filter((v) => v.id !== id),
    }
    
    fs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8', (error) => {
      const { list } = newAccountList;

      event.sender.send('main/getAccount', {
        success: true,
        code: 1,
        data: list,
        log: '성공적으로 삭제했어요.',
      });
    });
  });
});

ipcMain.on('main/updateAccount', (event, accountData) => {

  fs.readFile(AccountListPath, 'utf8', (error, prevAccountData) => {
    if (error) {
      event.sender.send('main/getAccount', {
        success: false,
        code: 2,
        log: error,
      });
      return;
    } 
    const { siteNameKr, siteNameEng, protocol, siteUrl, accountId, accountPwd, id } = accountData;
    const url = protocol + siteUrl;
    const { sequence, list } = JSON.parse(prevAccountData);
    const newAccountDataList = {
      sequence,
      list: list.map((v) => v.id === id
            ? { ...v, siteNameKr, siteNameEng, url, accountId, accountPwd }
            : { ...v })
      }

    fs.writeFile(AccountListPath, JSON.stringify(newAccountDataList), 'utf8', (error) => {
      const { list } = newAccountDataList;

      event.sender.send('main/getAccount', {
        success: true,
        code: 1,
        data: list,
        log: '성공적으로 수정했어요.',
      });
    });
  });
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