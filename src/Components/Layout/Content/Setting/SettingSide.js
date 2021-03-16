import React from 'react';
import styled from 'styled-components';
import { Menu, Layout } from 'antd';

const { Sider } = Layout;

const SettingSide = () => {
  return (
    <Sider>
      <CustomMenu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          <CustomMenuItem key="1">
            연동 계정 설정
          </CustomMenuItem>
          <CustomMenuItem key="2">
            Option 2
          </CustomMenuItem>
          <CustomMenuItem key="3">
            Option 3
          </CustomMenuItem>
      </CustomMenu>
    </Sider>
  )
};

const CustomMenu = styled(Menu)`
  border-right: 1px solid #30353c;
`;

const CustomMenuItem = styled(Menu.Item)`
  width: 100% !important;
  height: 30px !important;
  line-height: 30px !important;

  & :hover, :focus, :active {
    color: #4694df !important;
    background-color: transparent !important;
  }

  &::after {
    display: none;
  }

  &.ant-menu-item-selected {
    color: #4694df !important;
    background-color: transparent !important;
  }

  &.ant-menu-item-selected:hover {
    color: #4694df !important;
  }
`;

export default SettingSide;