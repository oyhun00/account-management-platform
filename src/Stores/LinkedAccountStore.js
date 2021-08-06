import { makeAutoObservable, action, toJS } from "mobx";
import { message } from 'antd';

const { ipcRenderer } = window;

class LinkedAccountStore {
  linkedAccountList = [];

  linkedAccountFormat = {
    siteNameKr: '',
    siteNameEng: '',
    siteIcon: ''
  };

  formOption = {
    isUpdate: false,
    isVisible: false
  };

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  formValidation = () => {
    const { siteNameKr, siteNameEng } = this.linkedAccountFormat;

    if(!siteNameKr || !siteNameEng) {
      return false;
    } else {
      return true;
    }
  };

  clearFormat = () => {
    this.accountFormat = {
      siteNameKr: '',
      siteNameEng: '',
      siteIcon: '',
    };
  };

  modalClose = () => {
    this.formOption = {
      isUpdate: false,
      isVisible: false
    };
    this.clearFormat();
  };

  toggleCreateLinkedAccount = () => {
    this.formOption.isVisible = true;
  };

  formChangeHandle = (e) => {
    const { value, name } = e.target;

    this.linkedAccountFormat = {
      ...this.linkedAccountFormat,
      [name]: value,
    }
  };

  getLinkedAccountList = () => {
    ipcRenderer.invoke('link/getAccount')
      .then(
        action((result) => {
          const { success, log } = result;

          if (success) {
            const { linkedAccountData } = result;
            this.linkedAccountList = linkedAccountData;
            console.log(this.linkedAccountList);
            if (log) {
              message.success(log);
            }
          } else {
            message.error(log);
          }
        }
      ));
  };

  getLinkedAccountDetail = (id) => {
    ipcRenderer.invoke('link/getAccountDetail', id)
      .then(
        action((result) => {
        const { success, log } = result;

        if (success) {
          const { data } = result;
          
          this.linkedAccountFormat = {
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

  removeLinkedAccount = (id) => {
    ipcRenderer.invoke('link/removeAccount', id)
      .then(
        action((result) => {
          const { success, log } = result;

          if (success) {
            const { linkedAccountData } = result;

            this.linkedAccountList = linkedAccountData;

            if (log) {
              message.success(log);
            }
          } else {
            message.error(log);
          }
        })
      );
  };

  formSubmit = (_action) => {
    if(!this.formValidation()) {
      message.error("필수 입력 값을 확인해 주세요.");

      return false;
    }
    this.linkedAccountFormat.group = 0;

    const channel = _action === 'create' ? 'link/createAccount' : 'link/updateAccount';

    ipcRenderer.invoke(channel, toJS(this.linkedAccountFormat))
      .then(
        action((result) => {
          const { success, log } = result;

          if (success) {
            const { linkedAccountData } = result;

            this.linkedAccountList = linkedAccountData;
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

export default LinkedAccountStore;