import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, Input, Row, Col, message } from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import MenuItem from './Menu';
const { ipcRenderer } = window;

const Side = ({ onGroupSelect }) => {
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
  }

  const removeMenu = (e, id) => {
    ipcRenderer.send('side/removeMenu', id);
  }

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
  }

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
  } 

  const changeHandle = (e) => {
    setMenuName(e.target.value);
  }

  const updateChangeHandle = (e) => {
    setUpdateValue(e.target.value);
  }

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
      <CustomMenuItem key={v.id} onClick={() => onGroupSelect(v.id)}>
        <MenuItem
          data={v}
          updateValue={updateValue}
          updateChangeHandle={updateChangeHandle}
          updateMenuSubmit={updateMenuSubmit}
          updateMenuToggle={updateMenuToggle}
          removeMenu={removeMenu}
          onGroupSelect={onGroupSelect}
        />
      </CustomMenuItem>
    )
  );
  
  return (
    <CustomSider>
      <CustomMenu defaultSelectedKeys={['0']} defaultOpenKeys={['sub0']} mode="inline" theme="dark">
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
                  <PlusOutlined/>
                </>
              )
          }
        </CustomPlusIconWrap>
      </CustomRow>
    </CustomSider>
  );
}

const CustomSider = styled.div`
  background: #19171d;
  color: rgba(255, 255, 255, 0.65);
`;

const CustomMenu = styled(Menu)`
  background: #19171d !important;

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

  & :hover {
    color: #fff;
  }
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

export default Side;
