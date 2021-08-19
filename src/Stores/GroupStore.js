import { makeAutoObservable, action } from "mobx";
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { ipcRenderer } = window;

class GroupStore {
  isAdd = false;

  groupList = [];

  groupAddValue = '';

  groupUpdateValue = '';

  selectedGroup = '';

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  onChangeValue = (e) => {
    this[e.target.name] = e.target.value;
  };

  setSelectedGroup = (value) => {
    this.selectedGroup = value;
  };

  setAddStatus = () => {
    this.isAdd = !this.isAdd;
  };

  getGroupList = () => {
    ipcRenderer.invoke('side/getGroupList')
      .then(
        action((result) => {
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
        })
      );
  };

  getFirstGroup = () => {
    ipcRenderer.invoke('side/getFirstGroup')
      .then(
        action((result) => {
          const { success } = result;

          if (success) {
            const { data, log, code } = result;
            this.selectedGroup = code === 1 ? data : 0;

            if (log) {
              message.success(log);
            }
          } else {
            message.error(result.log);
          }
        })
      );
  };

  addGroup = () => {
    if(!this.groupAddValue) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }

    ipcRenderer.invoke('side/createGroup', this.groupAddValue)
      .then(
        action((result) => {
          const { success } = result;
          
          if (success) {
            const { data, log } = result;
            this.groupList = data;
            this.selectedGroup = data[data.length - 1].id;
            this.isAdd = !this.isAdd;

            if (log) {
              message.success(log);
            }
          } else {
            message.error(result.log);
          }
        })
      );
  };

  removeGroup = (id) => {
    const _this = this;

    Modal.confirm({
      title: '정말로 삭제하시겠어요?',
      icon: <ExclamationCircleOutlined />,
      content: '해당 그룹에 저장된 계정 정보도 모두 사라집니다.',
      onOk() {
        ipcRenderer.invoke('side/removeGroup', id)
          .then(
            action((result) => {
              const { success } = result;
          
              if (success) {
                const { data, log } = result;
                _this.groupList = data;
                _this.selectedGroup = data[data.length - 1].id;
    
                if (log) {
                  message.success(log);
                }
              } else {
                message.error(result.log);
              }
            })
          );
      },
      onCancel() {
      },
    });
  };

  toggleUpdateGroup = (e, id) => {
    e.stopPropagation();
    
    const { groupName } = this.groupList.find((v) => v.id === id);

    this.groupUpdateValue = groupName;

    const addedGroupList = this.groupList.map(
      (v) => v.id === id
        ? { ...v, updateStatus: !v.updateStatus } 
        : { ...v, updateStatus: v.updateStatus }
    )
    this.groupList = addedGroupList;
  };

  updateGroup = (id) => {
    if(!this.groupUpdateValue) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }
    
    const updateGroupList = this.groupList.map(
      (v) => v.id === id
        ? { ...v, groupName: this.groupUpdateValue, updateStatus: false } 
        : { ...v }
    );

    ipcRenderer.invoke('side/updateGroup', updateGroupList)
      .then(
        action((result) => {
          const { success } = result;

          if (success) {
            const { log } = result;

            if (log) {
              message.success(log);
            }

            this.groupList = updateGroupList;
          }
          else {
            message.error(result.log);
          }
        })
      );
  };
}

export default GroupStore;
