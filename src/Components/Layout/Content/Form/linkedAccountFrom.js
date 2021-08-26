import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Form, Input, Modal, Button, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useStores from '../../../../Stores/UseStore';

const linkedAccountForm = observer(({ formOption }) => {
  const { isVisible, isUpdate } = formOption;
  const { LinkedAccountStore } = useStores();
  const {
    linkedAccountFormat, formSubmit, formChangeHandle,
    fileChangeHandle, modalClose, deleteLocalIcon
  } = LinkedAccountStore;
  const {
    siteNameKr, siteNameEng, accountId,
    accountPwd, iconUse, iconName
  } = linkedAccountFormat;

  return (
    <CustomModal
        title={isUpdate ? '연동계정 정보 수정' : '연동계정 정보 등록'}
        centered
        visible={isVisible}
        onOk={() => isUpdate ? formSubmit('update') : formSubmit('create')}
        onCancel={modalClose}
        width={500}
      >
      <CustomForm layout="vertical" size="large">
        <Form.Item label="한글 이름">
          <CustomInput name="siteNameKr" value={siteNameKr} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="영문 이름">
          <CustomInput name="siteNameEng" value={siteNameEng} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="계정 ID">
          <CustomInput name="accountId" value={accountId} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="계정 PW">
          <CustomInput name="accountPwd" value={accountPwd} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="">
          <Button size="default" icon={<UploadOutlined />} onClick={fileChangeHandle}>아이콘 선택</Button>
          {
            iconUse
            ? (
              <CustomTag closable onClose={deleteLocalIcon}>
                {iconName}
              </CustomTag>
            ) : ''
          }
        </Form.Item>
      </CustomForm>
    </CustomModal>
  );
});

const CustomModal = styled(Modal)`
  .ant-modal-close-x {
    height: 54px;
    line-height: 54px;
  }

  * {
    background-color: #1a1d21;
    color: #fff !important;
  }

  .ant-modal-header {
    border-bottom: 1px solid #30353c;
  }

  .ant-modal-footer {
    border-top: 0;
  }

  .ant-btn {
    border: 1px solid #6c6e71;

    > span { 
      background: transparent;
    }

    :hover, :active, :focus {
      background: #2a2d31;
    }
  }

  .ant-btn-primary {
    background: #1890ff;
    border-color: #1890ff;
    
    :hover {
      background: #65b5ff;
    }
  }
`;

const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label {
    padding: 0;
  }

  .ant-form-item-label > label {
    color: #d8d8d8 !important;
  }
`;

const CustomInput = styled(Input)`
  border: 1px solid #454b52;
`;

const CustomTag = styled(Tag)`
  margin-left: 10px;
`;

export default linkedAccountForm;
