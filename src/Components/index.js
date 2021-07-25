import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import Side from './Layout/Side';
import ContentBox from './Layout/Content';

const { Sider } = Layout;

const MainComponent = () => {
  return (
    <>
      <CustomSider>
        <Side/>
      </CustomSider>
      <CustomMainLayout>
        <ContentBox/>
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
