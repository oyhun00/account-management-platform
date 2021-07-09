import AccountStore from './AccountStore';

class RootStore {
  constructor() {
    this.AccountStore = new AccountStore(this);
  }
}

export default RootStore;