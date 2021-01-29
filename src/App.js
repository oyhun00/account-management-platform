import React from 'react';
import { Layout } from 'antd';
import Account from './Components/Account';
import Side from './Components/Layout/Side';
import ContentBox from './Components/Layout/Content';

const App = () => {
  return (
    <Layout>
      <Side />
      <Layout>
        <ContentBox />
      </Layout>
    </Layout>
  );
}

export default App;
