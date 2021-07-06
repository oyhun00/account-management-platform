import React, { useState, lazy } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import Util from './Layout/Content/Util';
const Side = lazy(() => import('./Layout/Side'));
const ContentBox = lazy(() => import('./Layout/Content'));

const { Sider } = Layout;

const MainComponent = () => {
  const [selectGroup, setSelectGroup] = useState(1);
  const [accountFormVisible, setAccountFormVisible] = useState({
    visible: false,
    update: false
  });
  const [SettingVisible, setSettingVisible] = useState(false)
  const [selectView, setSelectView] = useState(null);
  const [menuList, setMenuList] = useState([]);

  return (
    <>
      <CustomSider>
        <Side
          selectGroup={selectGroup}
          setSelectGroup={setSelectGroup}
          setSettingVisible={setSettingVisible}
          setSelectView={setSelectView}
          menuList={menuList}
          setMenuList={setMenuList}
        />
      </CustomSider>
      <CustomMainLayout>
        <ContentBox
          selectGroup={selectGroup}
          selectView={selectView}
          setAccountFormVisible={setAccountFormVisible}
          menuList={menuList}
        />
      </CustomMainLayout>
      <Util
        selectGroup={selectGroup}
        accountFormVisible={accountFormVisible}
        setAccountFormVisible={setAccountFormVisible}
        SettingVisible={SettingVisible}
        setSettingVisible={setSettingVisible}
      />
    </>
  );
};

const CustomSider = styled(Sider)`
  background: #19171d;
  border-right: 1px solid #2a272f;
  box-sizing: content-box;
  height: 100%;
`;

const CustomMainLayout = styled(Layout)`
  overflow: auto;
`;

export default MainComponent;
