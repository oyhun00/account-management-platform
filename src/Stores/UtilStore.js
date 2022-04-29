import { makeAutoObservable } from 'mobx';

class UtilStore {
  isLoading = false;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }
}

export default UtilStore;
