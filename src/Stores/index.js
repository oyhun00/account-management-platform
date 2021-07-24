import AccountStore from './AccountStore';
import GroupStore from './GroupStore';

class RootStore {
  constructor() {
    this.AccountStore = new AccountStore(this);
    this.GroupStore = new GroupStore(this); 
  }
}

export default new RootStore();