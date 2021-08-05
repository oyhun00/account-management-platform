import AccountStore from './AccountStore';
import GroupStore from './GroupStore';
import LinkedAccountStore from './LinkedAccountStore';

class RootStore {
  constructor() {
    this.LinkedAccountStore = new LinkedAccountStore(this);
    this.AccountStore = new AccountStore(this);
    this.GroupStore = new GroupStore(this); 
  }
}

export default new RootStore();