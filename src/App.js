import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import MainComponent from './Components';

const App = () => {
  return (
    <CustomLayout>
      <MainComponent />
    </CustomLayout>
  );
}

const CustomLayout = styled(Layout)`
  height: 100vh;
  background: #19171d;

  .ant-layout {
    background: #19171d;
  }
`;

export default App;
