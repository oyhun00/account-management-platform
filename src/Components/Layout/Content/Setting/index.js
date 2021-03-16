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
      <CustomLayout>
        <SettingSide />
        <SettingContent />
      </CustomLayout>
    </CustomModal>
  )
};

const CustomModal = styled(Modal)`
  .ant-modal-close-x {
    height: 54px;
    line-height: 54px;
  }

  * {
    background-color: #1a1d21;
    color: #fff;
  }

  .ant-modal-header {
    border-bottom: 1px solid #30353c;
  }

  .ant-modal-footer {
    border: 0;
  }
`;

const CustomLayout = styled(Layout)`
`;

export default Setting;