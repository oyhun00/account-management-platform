import React from 'react';
import { Modal } from 'antd';

const ConfirmModal = (props) => {
  const { confirmVisible, setConfirmVisible } = props;

  const handleOk = () => {
    setConfirmVisible(false);
  };

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  return (
    <>
      <Modal title="Basic Modal" visible={confirmVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  )
};

export default ConfirmModal;