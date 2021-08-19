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
    siteUrl: '',
    accountId: '',
    accountPwd: '',
    linkId: '',
    group: '',
  };
  
  isLink = false;

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
    this.accountFormOption.isVisible = true;
  };

  formValidation = () => {
    const { siteNameKr, siteUrl, accountId, accountPwd } = this.accountFormat;

    if(!siteNameKr || !siteUrl || !accountId || !accountPwd) {
      return false;
    }

    return true;
  };

  linkedOption = (value) => {
    this.isLink = value;
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
      siteUrl: '',
      accountId: '',
      accountPwd: '',
      linkId: '',
    };
  };

  modalClose = () => {
    this.accountFormOption = {
      isUpdate: false,
      isVisible: false
    };
    this.clearAccountFormat();
  };

  formSubmit = (_action) => {
    if(!this.formValidation()) {
      message.error("필수 입력 값을 확인해 주세요.");

      return false;
    }
    this.accountFormat.group = this.root.GroupStore.selectedGroup;
    this.root.UtilStore.isLoading = true;

    const channel = _action === 'create' ? 'main/createAccount' : 'main/updateAccount';

    ipcRenderer.invoke(channel, toJS(this.accountFormat))
      .then(
        action((result) => {
          const { success, log } = result;

          if (success) {
            const { accountData } = result;

            this.accountList = accountData;
            this.root.UtilStore.isLoading = false;
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