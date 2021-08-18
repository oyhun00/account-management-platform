const fs = require('fs').promises;
const cheerio = require('cheerio-httpcli');
const storage = require('electron-json-storage');
const defaultDataPath = storage.getDefaultDataPath();

const AccountListPath = defaultDataPath + '\\AccountList.json';
const LinkageListPath = './src/TempData/AccountLinkage.json';

exports.getAccount = async () => {
	try {
    const AccountLinkage = await fs.readFile(LinkageListPath);
    const AccountList = await fs.readFile(AccountListPath);
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
    const accountList = await fs.readFile(AccountListPath);
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
      
    fs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8')
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
    }

    fs.writeFile(AccountListPath, JSON.stringify(newAccountList), 'utf8');

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
    const { siteNameKr, siteNameEng, protocol, siteUrl, accountId, accountPwd, id } = accountData;
    const url = protocol + siteUrl;
    const AccountList = await fs.readFile(AccountListPath);
    const { sequence, list } = JSON.parse(AccountList);
    const newAccountDataList = {
      sequence,
      list: list.map((v) => v.id === id
            ? { ...v, siteNameKr, siteNameEng, url, accountId, accountPwd }
            : { ...v })
    };

    fs.writeFile(AccountListPath, JSON.stringify(newAccountDataList), 'utf8');

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