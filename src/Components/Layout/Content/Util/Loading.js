import React from 'react';
import styled from 'styled-components';
import { Spin, Space } from 'antd';

const Loading = () => {
  return (
    <CustomSpace size="middle">
      <CustomSpin size="large" />
    </CustomSpace>
  )
};

const CustomSpace = styled(Space)`
  background: #19171d;
  height: 100vh;
  width: 100vw;
  text-align: center;
  margin: 0 auto !important;

  & .ant-space-item {
    margin: 0 auto;
  }
`;

const CustomSpin = styled(Spin)`
  margin: 0 auto !important;
  text-align: center;
`;

export default Loading;