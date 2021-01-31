import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { Layout, Menu, Button, Input, Row, Col } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import MenuList from '../../../TempData/MenuList.json';

const { Sider } = Layout;

const Side = () => {
  useEffect(() =>{
    ipcRenderer.send('main-test1', 'start-ipc');
    ipcRenderer.on('renderer-test1', (event, res) => {
      console.log(res);
    })
  })

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
        {
          state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
        }
      </Button>
      <CustomMenu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline" theme="dark" inlineCollapsed={!state.collapsed}>
        {tempData}
      </CustomMenu>
      {
        state.Add 
          ? (
            <CustomRow>
              <Col span={20}>
                <CustomInput />
              </Col>
              <CustomPlusIconWrap span={4}>
                <PlusOutlined />
              </CustomPlusIconWrap>
            </CustomRow>
          )
          : ''
      }
      <CustomRow>
        <CustomPlusIconWrap onClick={toggleInsertMenu}>
          {
            state.Add
              ? (
                <>
                  <CloseOutlined />
                  <CustomSpan>Cancel</CustomSpan>
                </>
              )
              : (
                <>
                  <PlusOutlined />
                  <CustomSpan>Add</CustomSpan>
                </>
              )
          }
        </CustomPlusIconWrap>
      </CustomRow>
    </CustomSider>
  );
}

const CustomSider = styled(Sider)`
  background: #19171d;
  border-right: 1px solid #2a272f;
  color: rgba(255, 255, 255, 0.65);
`;

const CustomMenu = styled(Menu)`
  background: #19171d !important;
`;

const CustomMenuItem = styled(Menu.Item)`
  background-color: #19171d
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
    color: #fff;
  }
`;

const CustomSpan = styled.span`
  margin-left: 5px;
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
