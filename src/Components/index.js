import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import Side from './Layout/Side';
import ContentBox from './Layout/Content';

const { Sider } = Layout;

const MainComponent = () => {
  const [state, setState] = useState({
    selectGorup: 0,
  });

  const groupSelectHandle = (id) => {
    setState(id);
  }

  return (
    <>
      <CustomSider>
        <Side onGroupSelect={groupSelectHandle} />
      </CustomSider>
      <Layout>
        <ContentBox data={state} />
      </Layout>
    </>
  );
}

 const CustomSider = styled(Sider)`
  background: #19171d;
  border-right: 1px solid #2a272f;
  box-sizing: content-box;
  overflow: auto;
`;

export default MainComponent;
