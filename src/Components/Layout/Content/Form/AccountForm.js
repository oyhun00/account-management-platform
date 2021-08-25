import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Form, Input, Modal, Select, Button, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useStores from '../../../../Stores/UseStore';

const { Option } = Select;

const AccountForm = observer(({ accountFormOption, linkedAccountList }) => {
  const { isVisible, isUpdate } = accountFormOption;
  const { AccountStore } = useStores();
  const {
    accountFormat, formSubmit, formChangeHandle, fileChangeHandle,
    linkIdChangeHandle, isLink, linkedOption, modalClose, deleteLocalIcon
  } = AccountStore;
  const {
    siteNameKr, siteNameEng, siteUrl, isLocalIcon,
    accountId, accountPwd, linkId, iconName
  } = accountFormat;
  const linkedData = linkedAccountList.map((v, index) => {
      return <Option value={v.id} selected key={index}>{v.siteNameKr}</Option>
  });
  
  return (
    <CustomModal
        title={isUpdate ? '계정 정보 수정' : '계정 정보 등록'}
        centered
        visible={isVisible}
        onOk={() => isUpdate ? formSubmit('update') : formSubmit('create')}
        onCancel={modalClose}
        width={500}
      >
      <CustomForm layout="vertical" size="large">
        <Form.Item label="사이트 한글 이름">
          <CustomInput name="siteNameKr" value={siteNameKr} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="사이트 영문 이름">
          <CustomInput name="siteNameEng" value={siteNameEng} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="사이트 URL">
          <CustomInput name="siteUrl" value={siteUrl} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="계정 ID">
          <CustomSelect value={isLink} onChange={(e) => linkedOption(e)} style={{ width: '25%' }}>
            <Option value={false}>직접 입력</Option>
            <Option value={true}>계정 연동</Option>
          </CustomSelect>
          { isLink
            ? (
              <CustomSelect name="linkId" value={linkId} style={{ width: '70%' }} disabled={!isLink} onChange={(e) => linkIdChangeHandle(e)}>
                {linkedData}
              </CustomSelect>
            ) : (
              <CustomInput name="accountId" style={{ width: '70%' }} value={accountId} onChange={(e) => formChangeHandle(e)} />
            )
          }
        </Form.Item>
        <Form.Item label="계정 PW">
          <CustomInput name="accountPwd" value={accountPwd} disabled={isLink} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="">
          <Button size="default" icon={<UploadOutlined />} onClick={fileChangeHandle}>아이콘 직접 선택</Button>
          {
            isLocalIcon
            ? (
              <Tag closable onClose={deleteLocalIcon}>
                {iconName}
              </Tag>
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

  .ant-input-disabled {
    background: #181819;
    border: 1px solid #454b52;
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

const CustomSelect = styled(Select)`
  :first-child {
    margin-right: 5%;
  }

  .ant-select-selector {
    background-color: transparent !important;
    border: 1px solid #454b52 !important;
    padding: 0.5px 11px !important;
  }
`;

export default AccountForm;
