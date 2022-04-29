const fs = require('fs');
const storage = require('electron-json-storage');
const linkedData = require('../TempData/AccountLinkage');

const defaultDataPath = storage.getDefaultDataPath();

exports.checkExists = () => {
  if (!fs.existsSync(defaultDataPath)) {
    fs.mkdirSync(defaultDataPath);

    const format = {
      sequence: 1,
      list: [],
    };

    // eslint-disable-next-line no-unused-expressions
    fs.mkdirSync(`${defaultDataPath}\\image`) && !fs.existsSync(`${defaultDataPath}\\image`);
    fs.promises.writeFile(`${defaultDataPath}\\AccountList.json`, JSON.stringify(format));
    fs.promises.writeFile(`${defaultDataPath}\\LinkedAccountList.json`, JSON.stringify(linkedData.data));
    fs.promises.writeFile(`${defaultDataPath}\\GroupList.json`, JSON.stringify(format));
  }
};
