import { observable, action } from "mobx";
import { message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { ipcRenderer } = window;

class GroupStore {
  @observable groupCreationStatus = false;

  @observable groupList = [];

  @observable groupAddValue = '';

  @observable groupUpdateValue = '';

  @observable selectedGroup = '';

  constructor(root) {
    this.root = root;
  }

  @action onChangeValue = (e) => {

  };

  @action getGroupList = () => {
    ipcRenderer.send('side/getGroupList');
    ipcRenderer.on('side/getGroupList', (e, result) => {
      const { success } = result;

      if (success) {
        const { data, log } = result;
        this.groupList = data;

        if (log) {
          message.success(log);
        }
      } else {
        message.error(result.log);
      }
    });
  };

  @action addGroup = () => {
    const { groupName, groupCreationStatus } = this;
    if(!groupName) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }

    ipcRenderer.send('side/createGroup', groupName);
    groupCreationStatus = !groupCreationStatus;
  };

  @action removeGroup = (id) => {
    const { groupList, selectedGroup } = this;

    confirm({
      title: '정말로 삭제하시겠어요?',
      icon: <ExclamationCircleOutlined />,
      content: '해당 그룹에 저장된 계정 정보도 모두 사라집니다.',
      onOk() {
        ipcRenderer.send('side/removeGroup', id);
        selectedGroup = groupList[0].id;
      },
      onCancel() {
      },
    });
  };

  @action toggleUpdateGroup = (e, id) => {
    e.stopPropagation();
    
    const { groupList, groupUpdateValue } = this;
    const { menuName } = groupList.find((v) => v.id === id);

    groupUpdateValue = menuName;

    const addedGroupList = groupList.map(
      (v) => v.id === id
        ? { ...v, updateStatus: !v.updateStatus } 
        : { ...v, updateStatus: v.updateStatus }
    )
    groupList = addedGroupList;
  };

  @action updateGroup = (id) => {
    const { groupList, groupUpdateValue } = this;

    if(!groupUpdateValue) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }
    
    const updateMenuList = groupList.map(
      (v) => v.id === id
        ? { ...v, menuName: groupUpdateValue, updateStatus: false } 
        : { ...v }
    );
    groupList = updateMenuList;

    ipcRenderer.send('side/updateMenu', updateMenuList);
  };
}

export default GroupStore;
