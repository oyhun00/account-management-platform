import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import MenuList from '../../../TempData/MenuList.json';

const { Sider } = Layout;

const Side = () => {
  const [state, setState] = useState({
    collapsed: false,
    Add: false 
  });

  const toggleCollapsed = () => {
    setState({
      ...state,
      collapsed: !state.collapsed,
    });
  };

  const toggleInsertMenu = () => {
    setState({
      ...state,
      Add: !state.Add,
    });
  }

  console.log(state);
  
  const tempData = MenuList.map((v) => (<CustomMenuItem key={v.id} style={{ backgroundColor: '#19171d' }}>{v.menuName}</CustomMenuItem>));

  return (
    <CustomSider style={{ background: '#19171d' }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <CustomMenu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline" theme="dark" inlineCollapsed={!state.collapsed}>
        {tempData}
      </CustomMenu>
      <CustomPlusIcon onClick={toggleInsertMenu} />
      <p style={{color: '#fff'}}>{state.Add ? 'asdasd' : 'flase'}</p>
    </CustomSider>
  );
}

const CustomSider = styled(Sider)`
  background: #19171d;
  border-right: 1px solid #2a272f;
`;

const CustomMenu = styled(Menu)`
  background: #19171d !important;
`;

const CustomMenuItem = styled(Menu.Item)`
  background-color: #19171d
`;

const CustomPlusIcon = styled(PlusOutlined)`
  cursor: pointer;
  color: rgba(255, 255, 255, 0.65);
  padding: 10px 0 20px 24px;

  :hover {
    color: #fff;
  }
`

export default Side;
