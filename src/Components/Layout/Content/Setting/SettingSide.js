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
            Option 1
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
  border-right: 0 !important;
`;

const CustomMenuItem = styled(Menu.Item)`
  height: 30px !important;
  line-height: 30px !important;

  & :hover, :focus, :active {
    color: #fff;
    background-color: #1264a3 !important;
  }

  &.ant-menu-item-selected {
    background-color: #1264a3 !important;
  }

  &.ant-menu-item-selected:hover {
    color: #fff;
  }
`;

export default SettingSide;