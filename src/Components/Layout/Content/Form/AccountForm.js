import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Input, Modal, message, Select } from 'antd';

const { ipcRenderer } = window;
const { Option } = Select;

const AccountForm = (props) => {
  const { selectGroup, accountFormVisible, setAccountFormVisible } = props;
  const { visible, update } = accountFormVisible;

  const [accountFormat, setAccountFormat] = useState({
    siteNameKr: '',
    siteNameEng: '',
    protocol: 'http://',
    siteUrl: '',
    accountId: '',
    accountPwd: '',
    group: selectGroup,
  });

  const formClear = () => {
    setAccountFormat({
      siteNameKr: '',
      siteNameEng: '',
      protocol: 'http',
      siteUrl: '',
      accountId: '',
      accountPwd: '',
      group: selectGroup,
    })
  };

  const protocolChangeHandle = (e) => {
    setAccountFormat({
      ...accountFormat,
      protocol: e
    })
  };
  
  const formChangeHandle = (e) => {
    const { value, name } = e.target;

    setAccountFormat({
      ...accountFormat,
      [name]: value, 
      group: selectGroup,
    });
  };

  const formSubmit = () => {
    const { siteNameKr, siteUrl, accountId, accountPwd } = accountFormat;

    if(!siteNameKr || !siteUrl || !accountId || !accountPwd) {
      message.error("필수 입력 값을 확인해 주세요.");

      return;
    }

    ipcRenderer.send('main/createAccount', accountFormat);

    setAccountFormVisible(false);
    
    formClear();
  };

  const formUpdateSubmit = () => {
    const { siteNameKr, siteUrl, accountId, accountPwd } = accountFormat;

    if(!siteNameKr || !siteUrl || !accountId || !accountPwd) {
      message.error("필수 입력 값을 확인해 주세요.");

      return;
    }

    ipcRenderer.send('main/updateAccount', accountFormat);

    setAccountFormVisible(false);

    formClear();
  };

  const modalClosed = () => {
    formClear();
    setAccountFormVisible(false);
  };

  useEffect(() => {
    ipcRenderer.on('main/getAccountDetail', (e, result) => {
      const { success } = result;
      console.log(result);

      if (success) {
        const { data } = result;
        setAccountFormat(data);
      } else {
        message.error(result.log);
      }
    });
  }, [selectGroup, accountFormat, visible]);

  const { siteNameKr, siteNameEng, protocol, siteUrl, accountId, accountPwd } = accountFormat;
  
  return (
    <CustomModal
        title={update ? '계정 정보 수정' : '계정 정보 등록'}
        centered
        visible={visible}
        onOk={() => update ? formUpdateSubmit() : formSubmit()}
        onCancel={modalClosed}
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
          <CustomSelect value={protocol} onChange={(e) => protocolChangeHandle(e)} style={{ width: '25%' }}>
            <Option value="http://">http</Option>
            <Option value="https://">https</Option>
          </CustomSelect>
          <CustomInput name="siteUrl" value={siteUrl} style={{ width: '70%' }} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="계정 ID">
          <CustomInput name="accountId" value={accountId} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="계정 PW">
          <CustomInput name="accountPwd" value={accountPwd} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
      </CustomForm>
    </CustomModal>
  );
}

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

    :hover {
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

const CustomSelect = styled(Select)`
  margin-right: 5%;

  .ant-select-selector {
    background-color: transparent !important;
    border: 1px solid #454b52 !important;
    padding: 0.5px 11px !important;
  }
`;

export default AccountForm;
