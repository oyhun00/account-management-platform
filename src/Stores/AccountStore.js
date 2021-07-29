import { makeAutoObservable, action, toJS } from "mobx";
import { message } from 'antd';

const { ipcRenderer } = window;

class AccountStore {
  accountList = [];

  accountFormOption = {
    isUpdate: false,
    isVisible: false
  };
  
  accountFormat = {
    siteNameKr: '',
    siteNameEng: '',
    protocol: 'http://',
    siteUrl: '',
    accountId: '',
    accountPwd: '',
    group: '',
  }

  linkedAccountList = [];

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  getAccountDetail = (id) => {
    ipcRenderer.invoke('main/getAccountDetail', id)
      .then(
        action((result) => {
        const { success, log } = result;

        if (success) {
          const { data } = result;
          
          this.accountFormat = {
            ...data
          };

          this.accountFormOption = {
            ...this.accountFormOption,
            isUpdate: true,
            isVisible: true
          };

          if(log) {
            message.success(log);
          }
        } else {
          message.error(log);
        }
      })
    );
  };

  getAccountList = () => {
    ipcRenderer.invoke('main/getAccount')
      .then(action((result) => {
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
      }));
  };

  removeAccount = (id) => {
    ipcRenderer.invoke('main/removeAccount', id)
      .then(
        action((result) => {
          const { success, log } = result;

          if (success) {
            const { accountData } = result;

            this.accountList = accountData;

            if (log) {
              message.success(log);
            }
          } else {
            message.error(log);
          }
        })
      );
  };

  toggleCreateAccount = () => {
    this.accountFormOption = {
      ...this.accountFormOption,
      isUpdate: false,
      isVisible: true
    };
  };

  formValidation = () => {
    const { siteNameKr, siteUrl, accountId, accountPwd } = this.accountFormat;

    if(!siteNameKr || !siteUrl || !accountId || !accountPwd) {
      return false;
    } else {
      return true;
    }
  };

  protocolChangeHandle = (value) => {
    this.accountFormat.protocol = value;
  };

  formChangeHandle = (e) => {
    const { value, name } = e.target;

    this.accountFormat = {
      ...this.accountFormat,
      [name]: value,
    }
  };

  clearAccountFormat = () => {
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

  modalClose = () => {
    this.accountFormOption.isVisible = false;
    this.clearAccountFormat();
  };

  formSubmit = (_action) => {
    if(!this.formValidation()) {
      message.error("필수 입력 값을 확인해 주세요.");

      return false;
    }
    this.accountFormat.group = this.root.GroupStore.selectedGroup;

    const channel = _action === 'create' ? 'main/createAccount' : 'main/updateAccount';

    ipcRenderer.invoke(channel, toJS(this.accountFormat))
      .then(
        action((result) => {
          console.log(result);
          const { success, log } = result;

          if (success) {
            const { accountData } = result;

            this.accountList = accountData;
            this.modalClose();

            if (log) {
              message.success(log);
            }
          } else {
            message.error(log);
          }
        })
      );
  };
}

export default AccountStore;