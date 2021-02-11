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
    event.sender.send('side/getMenuList', JSON.parse(data));
  })
});

ipcMain.on('side/addMenu', (event, newMenuName) => {
  fs.readFile('./src/TempData/MenuList.json', 'utf8', (error, data) => {
    const prevMenuList = JSON.parse(data);
    const newMenu = {
      id: prevMenuList.length,
      menuName: newMenuName,
      menuIndex: prevMenuList.length,
      updateStatus: false
    };

    const newMenuList = prevMenuList.concat(newMenu);
  
    fs.writeFile('./src/TempData/MenuList.json', JSON.stringify(newMenuList), 'utf8', (error) => {
      if (error) {
        event.sender.send('side/addMenu', `error : ${error}`);
      }
      event.sender.send('side/getMenuList', newMenuList);
    });
  });
});

ipcMain.on('side/updateMenu', (event, data) => {
  fs.writeFile('./src/TempData/MenuList.json', JSON.stringify(data), 'utf8', (error) => {
    if (error) {
      event.sender.send('side/getMenuList', newMenuList);
    }
  });
})

ipcMain.on('side/removeMenu', (event, id) => {
  fs.readFile('./src/TempData/MenuList.json', 'utf8', (error, data) => {
    const newMenuList = JSON.parse(data).filter((v) => v.id !== id);
    if(error) {
      event.sender.send('side/getMenuList', newMenuList);
    }
    
    fs.writeFile('./src/TempData/MenuList.json', JSON.stringify(newMenuList), 'utf8', (error) => {
      if (error) {
        event.sender.send('side/getMenuList', newMenuList);
      }
      event.sender.send('side/getMenuList', newMenuList);
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