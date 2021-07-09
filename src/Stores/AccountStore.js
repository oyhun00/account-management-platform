import { observable, action } from "mobx";
import { message } from 'antd';

const { ipcRenderer } = window;

class AccountStore {
  @observable accountList = [];

  @observable linkedAccountList = [];

  constructor(root) {
    this.root = root;
  }

  @action getAccountList = () => {
    ipcRenderer.send('main/getAccount');
    ipcRenderer.on('main/getAccount', (e, result) => {
      const { success, log } = result;

      if (success) {
        const { accountData, linkData } = result;
        
        this.accountList = accountData;
        this.linkedAccountList = linkData;

        if (log) {
          message.success(log);
        }
      } else {
        message.error(log);
      }
    });
  };
}

export default AccountStore;