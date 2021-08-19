import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Spin, Space } from 'antd';

const Loading = observer(() => {
  return (
    <CustomSpace size="middle">
      <CustomSpin size="large" />
    </CustomSpace>
  )
});

const CustomSpace = styled(Space)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  background: rgb(25 23 29 / 73%);
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