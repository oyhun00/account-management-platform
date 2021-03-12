import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, Input, Row, Col, message, Modal } from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import MenuItem from './Menu';
const { ipcRenderer } = window;
const { confirm } = Modal;

const Side = (props) => {
  const { setSelectGroup, selectGroup } = props;

  const [add, setAdd] = useState(false);
  const [updateValue, setUpdateValue] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuList, setMenuList] = useState([]);

  const addMenu = () => {
    if(!menuName) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }

    ipcRenderer.send('side/createMenu', menuName);
    setAdd(!add);
  };

  const removeMenu = (id) => {
    confirm({
      title: '정말로 삭제하시겠어요?',
      icon: <ExclamationCircleOutlined />,
      content: '해당 그룹에 저장된 계정 정보도 모두 사라집니다.',
      onOk() {
        ipcRenderer.send('side/removeMenu', id);
        setSelectGroup(menuList[0].id)
      },
      onCancel() {
      },
    });
  };

  const updateMenuToggle = (e, id) => {
    e.stopPropagation();

    const { menuName } = menuList.find((v) => v.id === id);
    
    setUpdateValue(menuName);
    setMenuList(
      menuList.map(
        (v) => v.id === id
          ? { ...v, updateStatus: !v.updateStatus } 
          : { ...v, updateStatus: v.updateStatus }
      )
    );
  };

  const updateMenuSubmit = (id) => {
    if(!updateValue) {
      message.warning('최소 1글자 이상 입력하세요.');
      return;
    }
    
    const updateMenuList = menuList.map(
      (v) => v.id === id
        ? { ...v, menuName: updateValue, updateStatus: false } 
        : { ...v }
    );
    setMenuList(updateMenuList);

    ipcRenderer.send('side/updateMenu', updateMenuList);
  };

  const changeHandle = (e) => {
    setMenuName(e.target.value);
  };

  const updateChangeHandle = (e) => {
    setUpdateValue(e.target.value);
  };

  useEffect(() => {
    ipcRenderer.send('side/getMenuList');
    ipcRenderer.on('side/getMenuList', (e, result) => {
      const { success } = result;

      if (success) {
        const { data, log } = result;
        setMenuList(data);

        if (log) {
          message.success(log);
        }
      } else {
        message.error(result.log);
      }
    });
  }, []);
  
  const menuItem = menuList.map((v) =>
    (
      <CustomMenuItem key={v.id} onClick={() => setSelectGroup(v.id)}>
        <MenuItem
          data={v}
          updateValue={updateValue}
          updateChangeHandle={updateChangeHandle}
          updateMenuSubmit={updateMenuSubmit}
          updateMenuToggle={updateMenuToggle}
          removeMenu={removeMenu}
        />
      </CustomMenuItem>
    )
  );

  const Temp = SortableContainer(() => {
    return (
    <CustomMenu defaultSelectedKeys={[selectGroup.toString()]} defaultOpenKeys={[`sub${selectGroup.toString()}`]} selectedKeys={[selectGroup.toString()]} mode="inline" theme="dark">
      {menuItem}
    </CustomMenu>
    )
  })
  
  return (
    <CustomSider>
      <CustomMenu defaultSelectedKeys={[selectGroup.toString()]} defaultOpenKeys={[`sub${selectGroup.toString()}`]} selectedKeys={[selectGroup.toString()]} mode="inline" theme="dark">
        {menuItem}
      </CustomMenu>
      {
        add
          ? (
            <CustomRow>
              <Col span={20}>
                <CustomInput onChange={changeHandle} />
              </Col>
              <CustomPlusIconWrap span={4} onClick={addMenu} >
                <PlusOutlined/>
              </CustomPlusIconWrap>
            </CustomRow>
          )
          : ''
      }
      <CustomRow>
        <CustomPlusIconWrap onClick={() => setAdd(!add)}>
          {
            add
              ? (
                <>
                  <CloseOutlined/>
                </>
              )
              : (
                <>
                  <CustomPlusOutlined/>
                  <AddComment>그룹 추가</AddComment>
                </>
              )
          }
        </CustomPlusIconWrap>
      </CustomRow>
      <CustomFixedRow>
        <CustomSettingOutlined />
      </CustomFixedRow>
    </CustomSider>
  );
}

const CustomSider = styled.div`
  position: relative;
  background: #19171d;
  color: rgba(255, 255, 255, 0.65);
  height: 100%;
`;

const CustomMenu = styled(Menu)`
  background: #19171d !important;
  overflow: auto;
  // height: calc(100% - 75px);

  & .ant-menu-item-selected {
    background-color: #242229 !important;
  }
`;

const CustomMenuItem = styled(Menu.Item)`
  background-color: #19171d;
`;

const CustomRow = styled(Row)`
  padding: 0 16px 0 24px;
  height: 30px;
  line-height: 40px;
`;

const CustomPlusIconWrap = styled(Col)`
  text-align: center;
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

const CustomPlusOutlined = styled(PlusOutlined)`
  background: #332f3c;
  padding: 4px;
  border-radius: 3px;

  & > svg { 
    width: 0.9em;
    height: 0.9em;
  }
`;

const AddComment = styled.span`
  margin-left: 8px;
`;

const CustomInput = styled(Input)`
  background: rgb(40 39 44);
  border: 1px solid #4a4a4a;
  padding: 1px 11px;
  color: rgba(255, 255, 255, 0.65);

  :focus, :hover {
    border-color: #fff;
    color: #fff;
  }
`;

const CustomFixedRow = styled(Row)`
  position: fixed;
  bottom: 0;  
  padding: 15px 16px 15px 24px;
`;

const CustomSettingOutlined = styled(SettingOutlined)`
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

export default Side;
