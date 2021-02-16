const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path'); 
const fs = require('fs');
const MenuListPath = './src/TempData/MenuList.json';
const AccountListPath = './src/TempData/AccountList.json';

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
    });
  });
});

ipcMain.on('main/createAccount', (event, newAccountData) => {
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
      list: list.concat({
        id: _sequence,
        newAccountData
      })
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
  const { siteNameKr, siteNameEng, siteUrl, accountId, accountPwd, id } = accountData;

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
    const newAccountDataList = {
      sequence,
      list: list.map((v) => v.id === id
            ? { ...v, siteNameKr, siteNameEng, siteUrl, accountId, accountPwd }
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