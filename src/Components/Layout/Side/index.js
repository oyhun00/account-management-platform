import React from 'react';

import styled from 'styled-components';
import { Menu, Input, Row, Col } from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import MenuList from '../../../TempData/MenuList.json';

const Side = ({ data, onAddToggle }) => {
  const { collapsed, add } = data;
  const tempData = MenuList.map((v) => (<CustomMenuItem key={v.id}>{v.menuName}</CustomMenuItem>));
  
  return (
    <CustomSider>
      <CustomMenu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline" theme="dark">
        {tempData}
      </CustomMenu>
      {
        add 
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
      <CustomRow style={ collapsed ? { padding: '0' } : {}}>
        <CustomPlusIconWrap onClick={onAddToggle} style={ collapsed ? { margin: '0 auto' } : {}}>
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
  margin-top: 48px;
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
