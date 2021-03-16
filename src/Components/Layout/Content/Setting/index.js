import React from 'react';
import styled from 'styled-components';
import { Modal, Layout } from 'antd';
import SettingSide from './SettingSide';
import SettingContent from './SettingContent';

const Setting = (props) => {
  const { SettingVisible, setSettingVisible } = props;

  return (
    <CustomModal
        title="환경 설정"
        centered
        visible={SettingVisible}
        onOk={() => setSettingVisible(false)}
        onCancel={() => setSettingVisible(false)}
        width={1000}
        bodyStyle={{ padding: 0 }}
      >
      <Layout>
        <SettingSide />
        <SettingContent />
      </Layout>
    </CustomModal>
  )
};

const CustomModal = styled(Modal)`
  * {
    background-color: #1a1d21;
    color: #fff;
  }
`;

export default Setting;