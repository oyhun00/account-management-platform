import { makeAutoObservable } from "mobx";
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

  testData = 1;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  test = () => {
    this.testData = this.testData + 1;
    console.log(this.testData);
  };

  getAccountDetail = (id) => {
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

  getAccountList = () => {
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

  removeAccount = (id) => {
    ipcRenderer.send('main/removeAccount', id);
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
    }
  };

  protocolHandleChange = (value) => {
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

  formSubmit = (action) => {
    if(!this.formValidation()) {
      message.error("필수 입력 값을 확인해 주세요.");

      return false;
    }

    const channel = action === 'create' ? 'main/createAccount' : 'main/uddateAccount';

    ipcRenderer.send(channel, this.accountFormat);

    this.modalClose();
  };
}

export default AccountStore;