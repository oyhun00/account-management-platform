const { dialog } = require('electron');
const afs = require('fs');
const fs = afs.promises;
const path = require('path'); 
const cheerio = require('cheerio-httpcli');
const storage = require('electron-json-storage');
const defaultDataPath = storage.getDefaultDataPath();
const log = require('electron-log');

const AccountListPath = defaultDataPath + '\\AccountList.json';
let iconPath = '';

exports.getIconPath = async () => {
  try {
    const _dialog = await dialog.showOpenDialog({
      filters: [{ name: 'images', extensions: ['jpg', 'png', 'gif', 'ico']}],
      properties: ['openFile',]
    });

    if(!_dialog.canceled) {
      iconPath = _dialog.filePaths[0];
      const iconName = iconPath.split('\\');

      const result = {
        success: true,
        code: 1,
        iconPath,
        iconName: iconName[iconName.length - 1]
      };

      return result;
    }
    
    iconPath = '';

    return { success: false }
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message
    };

    return result;
  }
};

exports.getAccount = async () => {
	try {
    const AccountList = await fs.readFile(AccountListPath);
    const { list } = JSON.parse(AccountList);
    const result = {
      success: true,
      code: 1,
      accountData: list,
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
    const AccountList = await fs.readFile(AccountListPath);
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
};

exports.createAccount = async (event, newAccountData) => {
  const { siteUrl, isLocalIcon } = newAccountData;
  iconPath = isLocalIcon ? iconPath : '';

  const url = siteUrl.match('http') ? siteUrl : 'https://' + siteUrl;
  let faviconLocation = !iconPath
    ? await cheerio.fetch(url)
      .then((result) => {
        const { $ } = result;
        const { href } = $('link[rel="shortcut icon"]')[0].attribs
          || $('link[rel="icon"]')[0].attribs
          || $('link[rel="apple-touch-icon"]')[0].attribs
          || $('link[rel="apple-touch-icon-precomposed"]')[0].attribs;

        if(href.match('http') || href.match('com')) { return href; }

        const filterd = url.indexOf('/', 8);
        if(filterd > 0) {
          return url.substring(0, filterd) + href;
        }

        return url + href;
      })
      .catch((error) => {
        log.info(error.message);
      })
    : '';
  try {
    const accountList = await fs.readFile(AccountListPath);
    const { sequence, list }  = JSON.parse(accountList);

    if(iconPath) {
      const faviconPath = defaultDataPath + '\\image';
      const outputName = `\\${(sequence + 1) + newAccountData.siteNameEng}a.png`;
      const input = afs.createReadStream(iconPath);
      const output = afs.createWriteStream(faviconPath + outputName);
  
      input.pipe(output);

      faviconLocation = path.normalize(faviconPath + outputName);
    }

    const newAccountList = {
      sequence: sequence + 1,
      list: list.concat(
        {
          ...newAccountData,
          siteUrl: siteUrl,
          siteIcon: faviconLocation,
          isLocalIcon: iconPath ? true : false,
          id: sequence + 1
        }
      )
    };

    fs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8');
    iconPath = '';

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
};

exports.removeAccount = async (event, id) => {
	try {
    const AccountList = await fs.readFile(AccountListPath);
    const { sequence, list } = JSON.parse(AccountList);
    const newAccountList = {
      sequence,
      list: list.filter((v) => v.id !== id),
    };

    fs.writeFile(AccountListPath, JSON.stringify(newAccountList), (err) => {
      if(err) {
        log.info('error', err);
      }
    });

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
};

exports.updateAccount = async (event, accountData) => {
	try {
    const {
      siteNameKr, siteNameEng, siteUrl, accountId,
      accountPwd, linkId, id, isLocalIcon, siteIcon, iconName
    } = accountData;

    iconPath = isLocalIcon ? iconPath : '';

    const url = siteUrl.match('http') ? siteUrl : 'https://' + siteUrl;
    let faviconLocation = !iconPath || isLocalIcon ? await cheerio.fetch(url)
    .then((result) => {
      const { $ } = result;
      const { href } = $('link[rel="shortcut icon"]')[0].attribs
        || $('link[rel="icon"]')[0].attribs
        || $('link[rel="apple-touch-icon"]')[0].attribs
        || $('link[rel="apple-touch-icon-precomposed"]')[0].attribs;

      if(href.match('http') || href.match('com')) { return href; }

      const filterd = url.indexOf('/', 8);
      if(filterd > 0) {
        return url.substring(0, filterd) + href;
      }

      return url + href;
    })
    .catch((error) => {
      log.info(error.message);
    }) : '';

    const AccountList = await fs.readFile(AccountListPath);
    const { sequence, list } = JSON.parse(AccountList);

    if(iconPath) {
      const day = new Date();
      const faviconPath = defaultDataPath + '\\image';
      const outputName = `\\${id + siteNameEng + day.getMilliseconds()}a.png`;
      const input = afs.createReadStream(iconPath);
      const output = afs.createWriteStream(faviconPath + outputName);
  
      input.pipe(output);

      faviconLocation = path.normalize(faviconPath + outputName);
    } else if (isLocalIcon) {
      faviconLocation = siteIcon;
    }

    const newAccountDataList = {
      sequence,
      list: list.map((v) => v.id === id
            ? { ...v, siteNameKr, siteNameEng, siteUrl, siteIcon: faviconLocation, accountId, accountPwd, linkId, isLocalIcon, iconName }
            : { ...v })
    };

    fs.writeFile(AccountListPath, JSON.stringify(newAccountDataList), 'utf8');
    iconPath = '';

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
};