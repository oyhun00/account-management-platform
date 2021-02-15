const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path'); 
const fs = require('fs');

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
  fs.readFile('./src/TempData/MenuList.json', 'utf8', (error, data) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }

    event.sender.send('side/getMenuList', {
      success: true,
      code: 1,
      data: JSON.parse(data),
    });
  })
});

ipcMain.on('side/createMenu', (event, newMenuName) => {
  fs.readFile('./src/TempData/MenuList.json', 'utf8', (error, data) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }

    const prevMenuList = JSON.parse(data);
    const newMenu = {
      id: prevMenuList.length,
      menuName: newMenuName,
      menuIndex: prevMenuList.length,
      updateStatus: false
    };

    const newMenuList = prevMenuList.concat(newMenu);
  
    fs.writeFile('./src/TempData/MenuList.json', JSON.stringify(newMenuList), 'utf8', (error) => {
      event.sender.send('side/getMenuList', {
        success: true,
        code: 1,
        data: newMenuList,
        log: '성공적으로 등록했어요.',
      });
    });
  });
});

ipcMain.on('side/updateMenu', (event, data) => {
  fs.writeFile('./src/TempData/MenuList.json', JSON.stringify(data), 'utf8', (error) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }
  });
})

ipcMain.on('side/removeMenu', (event, id) => {
  fs.readFile('./src/TempData/MenuList.json', 'utf8', (error, data) => {
    if (error) {
      event.sender.send('side/getMenuList', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }

    const newMenuList = JSON.parse(data).filter((v) => v.id !== id);
    
    fs.writeFile('./src/TempData/MenuList.json', JSON.stringify(newMenuList), 'utf8', (error) => {
      event.sender.send('side/getMenuList', {
        success: true,
        code: 1,
        data: newMenuList,
        log: '성공적으로 삭제했어요.',
      });
    });
  });
});


ipcMain.on('main/getAccount', (event, id) => {
  fs.readFile('./src/TempData/AccountList.json', 'utf8', (error, data) => {
    if (error) {
      event.sender.send('main/getAccount', {
        success: false,
        code: 2,
        log: error,
      });

      return;
    }

    event.sender.send('main/getAccount', {
      success: true,
      code: 1,
      data: JSON.parse(data),
    });
  });
});

ipcMain.on('main/createAccount', (event, newAccountData) => {
  fs.readFile('./src/TempData/AccountList.json', 'utf8', (error, prevAccountData) => {
    if (error) {
      event.sender.send('main/getAccount', {
        success: false,
        code: 2,
        log: error,
      });
      return;
    } 
    
    const prevAccountDataList = JSON.parse(prevAccountData);
    const newAccount = {
      ...newAccountData,
      id: prevAccountDataList.length,
    };

    const newAccountDataList = prevAccountDataList.concat(newAccount);
  
    fs.writeFile('./src/TempData/AccountList.json', JSON.stringify(newAccountDataList), 'utf8', (error) => {
      event.sender.send('main/getAccount', {
        success: true,
        code: 1,
        data: newAccountDataList,
        log: '성공적으로 등록했어요.',
      });
    });
  });
});

ipcMain.on('main/removeAccount', (event, id) => {
  fs.readFile('./src/TempData/AccountList.json', 'utf8', (error, prevAccountData) => {
    if (error) {
      event.sender.send('main/getAccount', {
        success: false,
        code: 2,
        log: error,
      });
      return;
    } 

    const newAccountDataList = JSON.parse(prevAccountData).filter((v) => v.id !== id);
    
    fs.writeFile('./src/TempData/AccountList.json', JSON.stringify(newAccountDataList), 'utf8', (error) => {
      event.sender.send('main/getAccount', {
        success: true,
        code: 1,
        data: newAccountDataList,
        log: '성공적으로 삭제했어요.',
      });
    });
  });
});

ipcMain.on('main/updateAccount', (event, accountData) => {
  const { siteNameKr, siteNameEng, siteUrl, accountId, accountPwd, id } = accountData;

  fs.readFile('./src/TempData/AccountList.json', 'utf8', (error, prevAccountData) => {
    if (error) {
      event.sender.send('main/getAccount', {
        success: false,
        code: 2,
        log: error,
      });
      return;
    } 
    
    const newAccountDataList = JSON.parse(prevAccountData).map(
        (v) => v.id === id
          ? { ...v, siteNameKr, siteNameEng, siteUrl, accountId, accountPwd }
          : { ...v }
      );

    fs.writeFile('./src/TempData/AccountList.json', JSON.stringify(newAccountDataList), 'utf8', (error) => {
      event.sender.send('main/getAccount', {
        success: true,
        code: 1,
        data: newAccountDataList,
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