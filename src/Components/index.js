import React, { useState, lazy } from 'react';
import useStores from '../Stores/UseStore';
import styled from 'styled-components';
import { Layout } from 'antd';
import Side from './Layout/Side';
import ContentBox from './Layout/Content';

const { Sider } = Layout;

const MainComponent = () => {
  const { AccountStore, GroupStore } = useStores();
  const { selectedGroup, groupList } = GroupStore;

  return (
    <>
      <CustomSider>
        <Side/>
      </CustomSider>
      <CustomMainLayout>
        <ContentBox
          groupList={groupList}
          selectedGroup={selectedGroup}
        />
      </CustomMainLayout>
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
