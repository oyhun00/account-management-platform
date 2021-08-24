const { dialog } = require('electron');
const afs = require('fs');
const fs = afs.promises;
const path = require('path'); 
const log = require('electron-log');
const storage = require('electron-json-storage');
const defaultDataPath = storage.getDefaultDataPath();
const LinkedAccountPath = defaultDataPath + '\\LinkedAccountList.json';
let iconPath = '';

exports.getIconPath = async () => {
  dialog.showOpenDialog({
    filters: [{ name: 'images', extensions: ['jpg', 'png', 'gif', 'ico']}],
    properties: ['openFile',]
  })
    .then((result) => {
      if(!result.canceled) {
        iconPath = result.filePaths[0];
      }
    }).catch((err) => log.info(err))
};

exports.getAccount = async () => {
  try {
    const LinkedAccountList = await fs.readFile(LinkedAccountPath);
    const { list } = JSON.parse(LinkedAccountList);
    const result = {
      success: true,
      code: 1,
      linkedAccountData: list,
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
};

exports.getAccountDetail = async (event, id) => {
  try {
    const LinkedAccountList = await fs.readFile(LinkedAccountPath);
    const { list } = JSON.parse(LinkedAccountList);
    const detail  = list.filter((v) => v.id === id);
    const result = {
      success: true,
      code: 1,
      data: detail[0]
    };

    return result;
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message
    };

    return result;
  }
};

exports.createAccount = async (event, newAccountData) => {
  try {
    const LinkedAccountList = await fs.readFile(LinkedAccountPath);
    const { sequence, list } = JSON.parse(LinkedAccountList);
    const faviconPath = defaultDataPath + '\\image';
    const outputName = `\\${(sequence + 1) + newAccountData.siteNameEng}l.png`;

    if(iconPath) {
      const input = afs.createReadStream(iconPath);
      const output = afs.createWriteStream(faviconPath + outputName);

      input.pipe(output);
    }
    
    const newAccountList = {
      sequence: sequence + 1,
      list: list.concat(
        {
          ...newAccountData,
          siteIcon: iconPath ? path.normalize(faviconPath + outputName) : '',
          id: sequence + 1
        }
      )
    };
    fs.writeFile(LinkedAccountPath, JSON.stringify(newAccountList), 'utf8');
    iconPath = '';
    const result = {
      success: true,
      code: 1,
      linkedAccountData: newAccountList.list,
      log: '성공적으로 등록했어요.',
    };

    return result;
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message
    };

    return result;
  }
};

exports.removeAccount = async (event, id) => {
  try {
    const LinkedAccountList = await fs.readFile(LinkedAccountPath);
    const { sequence, list } = JSON.parse(LinkedAccountList);
    const newAccountList = {
      sequence,
      list: list.filter((v) => v.id !== id),
    };
    fs.writeFile(LinkedAccountPath, JSON.stringify(newAccountList), 'utf8');

    const result = {
      success: true,
      code: 1,
      linkedAccountData: newAccountList.list,
      log: '성공적으로 삭제했어요.',
    };

    return result;
  } catch {
    const result = {
      success: false,
      code: 2,
      log: error.message
    };

    return result;
  }
};

exports.updateAccount = async (event, accountData) => {
  try {
    const { siteNameKr, siteNameEng, accountId, accountPwd, siteIcon, id } = accountData;
    const LinkedAccountList = await fs.readFile(LinkedAccountPath);
    const { sequence, list } = JSON.parse(LinkedAccountList);
    const faviconPath = defaultDataPath + '\\image';
    const day = new Date();
    const outputName = `\\${id + siteNameEng + day.getMilliseconds()}l.png`;
    
    if(iconPath) {
      const input = afs.createReadStream(iconPath);
      const output = afs.createWriteStream(faviconPath + outputName);

      input.pipe(output);
    }
    
    const newAccountDataList = {
      sequence,
      list: list.map((v) => v.id === id
            ? { ...v, siteNameKr, siteNameEng, accountId, accountPwd, siteIcon: iconPath ? path.normalize(faviconPath + outputName) : siteIcon, }
            : { ...v })
    };
    fs.writeFile(LinkedAccountPath, JSON.stringify(newAccountDataList), 'utf8');
    iconPath = '';

    const result = {
      success: true,
      code: 1,
      linkedAccountData: newAccountDataList.list,
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
};