import React, { useState, lazy } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import Util from './Layout/Content/Util';
const Side = lazy(() => import('./Layout/Side'));
const ContentBox = lazy(() => import('./Layout/Content'));

const { Sider } = Layout;

const MainComponent = () => {
  const [selectGroup, setSelectGroup] = useState(0);
  const [accountFormVisible, setAccountFormVisible] = useState({
    visible: false,
    update: false
  });

  console.log(selectGroup);

  return (
    <>
      <CustomSider>
        <Side
          selectGroup={selectGroup}
          setSelectGroup={setSelectGroup}
        />
      </CustomSider>
      <CustomMainLayout>
        <ContentBox
          selectGroup={selectGroup}
          setAccountFormVisible={setAccountFormVisible}
        />
      </CustomMainLayout>
      <Util
        selectGroup={selectGroup}
        accountFormVisible={accountFormVisible}
        setAccountFormVisible={setAccountFormVisible}
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
