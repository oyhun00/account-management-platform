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
    siteIcon: '',
    isLocalIcon: false,
    iconName: '',
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

          if(data.linkId) {
            this.isLink = true;
          }

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
          const { accountData } = result;
          
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
    const { siteNameKr, siteUrl, accountId, accountPwd, linkId } = this.accountFormat;
    
    if(this.isLink) {
      if(!siteNameKr || !siteUrl || !linkId) {
        return false;
      }

      return true;
    } else {
      if(!siteNameKr || !siteUrl || !accountId || !accountPwd) {
        return false;
      }

      return true;
    }
  };

  linkedOption = (value) => {
    this.isLink = value;

    if(value) {
      this.accountFormat = {
        ...this.accountFormat,
        linkId: this.root.LinkedAccountStore.linkedAccountList[0].id,
        accountId: '',
        accountPwd: '',
      };
    }
  };

  linkIdChangeHandle = (value) => {
    this.accountFormat.linkId = value;
  };

  fileChangeHandle = () => {
    ipcRenderer.invoke('main/getIconPath')
      .then(
        action((result) => {
          const { success } = result;

          if (success) {
            const { iconName } = result;

            this.accountFormat.iconName = iconName;
            this.accountFormat.isLocalIcon = true;
          }
        })
      );
  };

  formChangeHandle = (e) => {
    const { value, name } = e.target;

    this.accountFormat = {
      ...this.accountFormat,
      [name]: value,
    }
  };

  deleteLocalIcon = () => {
    this.accountFormat = {
      ...this.accountFormat,
      iconName: '',
      isLocalIcon: false,
    };
  };

  clearAccountFormat = () => {
    this.accountFormat = {
      ...this.accountFormat,
      siteNameKr: '',
      siteNameEng: '',
      siteUrl: '',
      accountId: '',
      accountPwd: '',
      siteIcon: '',
      isLocalIcon: false,
      linkId: '',
    };
    this.isLink = false;
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