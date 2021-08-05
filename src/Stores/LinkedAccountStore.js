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

  toggleCreateLinkedAccount = () => {
    this.formOption.isVisible = true;
  };

  getLinkedAccountList = () => {
    ipcRenderer.invoke('link/getAccount')
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
}

export default LinkedAccountStore;