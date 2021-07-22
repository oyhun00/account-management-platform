import { observable, action } from "mobx";
import { message } from 'antd';

const { ipcRenderer } = window;

class AccountStore {
  @observable accountList = [];

  @observable accountFormOption = {
    isUpdate: false,
    isVisible: false
  };
  
  @observable accountFormat = {
    siteNameKr: '',
    siteNameEng: '',
    protocol: 'http://',
    siteUrl: '',
    accountId: '',
    accountPwd: '',
    group: '',
  }

  @observable linkedAccountList = [];

  constructor(root) {
    this.root = root;
  }

  @action formChangeHandle = (e) => {
    const { value, name } = e.target;

    this.accountFormat = {
      ...this.accountFormat,
      [name]: value,
    }
  };

  @action clearAccountFormat = () => {
    this.accountFormat = {
      ...this.accountFormat,
      siteNameKr: '',
      siteNameEng: '',
      protocol: 'http://',
      siteUrl: '',
      accountId: '',
      accountPwd: '',
    };
  };

  @action toggleCreateAccount = () => {
    this.accountFormOption = {
      ...this.accountFormOption,
      isUpdate: false,
      isVisible: true
    };
  };

  @action getAccountDetail = (id) => {
    ipcRenderer.invoke('main/getAccountDetail', id)
      .then((result) => {
        const { success, log } = result;

        if (success) {
          const { data } = result;
          
          this.accountForm = {
            ...data
          };

          this.accountForm = {
            ...this.accountForm,
            isUpdate: true,
            isVisible: true
          };

          if(log) {
            message.success(log);
          }
        } else {
          message.error(log);
        }
      });
  };

  @action getAccountList = () => {
    ipcRenderer.invoke('main/getAccount')
      .then((result) => {
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

  @action removeAccount = (id) => {
    ipcRenderer.send('main/removeAccount', id);
  };
}

export default AccountStore;