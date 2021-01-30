import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import Account from './Components/Account';
import Side from './Components/Layout/Side';
import ContentBox from './Components/Layout/Content';

const App = () => {
  return (
    <Layout>
      <Side />
      <CustomLayout>
        <ContentBox />
      </CustomLayout>
    </Layout>
  );
}

const CustomLayout = styled(Layout)`
  height: 100vh;
  background: #19171d;
`;

export default App;
