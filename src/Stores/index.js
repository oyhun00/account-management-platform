import AccountStore from './AccountStore';
import GroupStore from './GroupStore';
import LinkedAccountStore from './LinkedAccountStore';
import UtilStore from './UtilStore';

class RootStore {
  constructor() {
    this.LinkedAccountStore = new LinkedAccountStore(this);
    this.AccountStore = new AccountStore(this);
    this.GroupStore = new GroupStore(this);
    this.UtilStore = new UtilStore(this);
  }
}

export default new RootStore();
