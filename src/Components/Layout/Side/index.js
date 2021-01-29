import React from 'react';
import { Layout, Menu } from 'antd';
import MenuList from '../../../TempData/MenuList.json';

const Side = () => {
  const tempData = MenuList.map((v) => (<Menu.Item key={v.id}>{v.menuName}</Menu.Item>));
  const { Sider } = Layout;

  return (
    <Sider>
      <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline">
        {tempData}
      </Menu>
    </Sider>
  );
}

export default Side;
