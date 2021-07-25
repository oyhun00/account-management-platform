import { makeAutoObservable, action } from "mobx";
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { ipcRenderer } = window;

class GroupStore {
  isAdd = false;

  groupList = [];

  groupAddValue = '';

  groupUpdateValue = '';

  selectedGroup = 2;

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

  // setSelectFirstGroup = () => {
    
  // };

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

  addGroup = async () => {
    if(!this.groupAddValue) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }

    const temp = await ipcRenderer.invoke('side/createGroup', this.groupAddValue);

    console.log(temp);
      // .then(
      //   action((result) => {
      //     const { success } = result;
          
      //     if (success) {
      //       const { data, log } = result;
      //       this.groupList = data;
      //       this.selectedGroup = data[data.length - 1];
      //       this.isAdd = !this.isAdd;

      //       if (log) {
      //         message.success(log);
      //       }
      //     } else {
      //       message.error(result.log);
      //     }
      //   })
      // );
  };

  removeGroup = (id) => {
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
                this.groupList = data;
                this.selectedGroup = data[data.length - 1];
    
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
    
    const { menuName } = this.groupList.find((v) => v.id === id);

    this.groupUpdateValue = menuName;

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
