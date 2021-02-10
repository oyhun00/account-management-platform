import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, Input, Row, Col } from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
  EditOutlined,
} from '@ant-design/icons';
const { ipcRenderer } = window;

const Side = ({ onGroupSelect }) => {
  const [add, setAdd] = useState(false);
  const [updateValue, setUpdateValue] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuList, setMenuList] = useState([]);

  const addMenu = () => {
    ipcRenderer.send('side/addMenu', menuName);
    setAdd(!add);
  }

  const removeMenu = (e, id) => {
    e.stopPropagation();
    ipcRenderer.send('side/removeMenu', id);
  }

  const updateMenu = (e, id) => {
    e.stopPropagation();
    setMenuList(
      menuList.map(
        (v) => v.id === id
          ? { ...v, updateStatus: true }
          : { ...v, updateStatus: false }
      )
    )
  }

  const changeHandle = (e) => {
    setMenuName(e.target.value);
  }

  useEffect(() => {
    ipcRenderer.send('side/getMenuList');
    ipcRenderer.on('side/getMenuList', (e, arg) => {
      setMenuList(arg);
    });
  }, []);
  
  const tempData = menuList.map((v) =>
    (
      <CustomMenuItem key={v.id} onClick={() => onGroupSelect(v.id)}>
        {v.updateStatus
          ? (
            <>
              <CustomInput value={v.menuName} />
              <CloseOutlined onClick={(e) => removeMenu(e, v.id)} />
              <EditOutlined  onClick={(e) => updateMenu(e, v.id)} />
            </>
          )
          : (
            <>
              {v.menuName}
              <CloseOutlined onClick={(e) => removeMenu(e, v.id)} />
              <EditOutlined  onClick={(e) => updateMenu(e, v.id)} />
            </>
          )}
      </CustomMenuItem>
    )
  );
  console.log(tempData);
  
  return (
    <CustomSider>
      <CustomMenu defaultSelectedKeys={['0']} defaultOpenKeys={['sub0']} mode="inline" theme="dark">
        {tempData}
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
