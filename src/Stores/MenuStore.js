import { observable, action } from "mobx";

const { ipcRenderer } = window;

class MenuStore {
  @observable menuList = [];

  constructor(root) {
    this.root = root;
  }

  @action getMenuList = () => {
    ipcRenderer.send('side/getMenuList');
    ipcRenderer.on('side/getMenuList', (e, result) => {
      const { success } = result;

      if (success) {
        const { data, log } = result;
        this.menuList = data;

        if (log) {
          message.success(log);
        }
      } else {
        message.error(result.log);
      }
    });
  }
}

export default MenuStore;