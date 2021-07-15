import { observable, action } from "mobx";
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { ipcRenderer } = window;

class GroupStore {
  @observable isAdd = false;

  @observable groupList = [];

  @observable groupAddValue = '';

  @observable groupUpdateValue = '';

  @observable selectedGroup = '';

  constructor(root) {
    this.root = root;
  }

  @action onChangeValue = (e) => {
    this[e.target.name] = e.target.value;
  };

  @action setSelectedGroup = (value) => {
    this.selectedGroup = value;
  };

  @action setAddStatus = () => {
    this.isAdd = !this.isAdd;
  };

  @action getGroupList = () => {
    ipcRenderer.invoke('side/getGroupList')
      .then((result) => {
        const { success } = result;

        if (success) {
          const { data, log } = result;
          this.groupList = data;
          console.log(this.groupList)

          if (log) {
            message.success(log);
          }
        } else {
          message.error(result.log);
        }
      });
  };

  @action addGroup = () => {
    if(!this.groupName) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }

    ipcRenderer.send('side/createGroup', this.groupName);
    this.groupCreationStatus = !this.groupCreationStatus;
  };

  @action removeGroup = (id) => {

    Modal.confirm({
      title: '정말로 삭제하시겠어요?',
      icon: <ExclamationCircleOutlined />,
      content: '해당 그룹에 저장된 계정 정보도 모두 사라집니다.',
      onOk() {
        ipcRenderer.send('side/removeGroup', id);
        this.selectedGroup = this.groupList[0].id;
      },
      onCancel() {
      },
    });
  };

  @action toggleUpdateGroup = (e, id) => {
    e.stopPropagation();
    
    const { menuName } = this.groupList.find((v) => v.id === id);

    this.groupUpdateValue = menuName;

    const addedGroupList = this.groupList.map(
      (v) => v.id === id
        ? { ...v, updateStatus: !v.updateStatus } 
        : { ...v, updateStatus: v.updateStatus }
    )
    this.groupList = addedGroupList;
  };

  @action updateGroup = (id) => {
    if(!this.groupUpdateValue) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }
    
    const updateMenuList = this.groupList.map(
      (v) => v.id === id
        ? { ...v, menuName: this.groupUpdateValue, updateStatus: false } 
        : { ...v }
    );
    this.groupList = updateMenuList;

    ipcRenderer.send('side/updateMenu', updateMenuList);
  };
}

export default GroupStore;
