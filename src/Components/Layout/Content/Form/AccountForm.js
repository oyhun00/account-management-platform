import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Input, Modal, message } from 'antd';
const { ipcRenderer } = window;

const AccountForm = (props) => {
  const { selectGroup, accountFormVisible, setAccountFormVisible } = props;
  const { visible, update } = accountFormVisible;

  const [accountFormat, setAccountFormat] = useState({
    siteNameKr: '',
    siteNameEng: '',
    siteUrl: '',
    accountId: '',
    accountPwd: '',
    group: selectGroup,
  });

  const formClear = () => {
    setAccountFormat({
      siteNameKr: '',
      siteNameEng: '',
      siteUrl: '',
      accountId: '',
      accountPwd: '',
      group: selectGroup,
    })
  };
  
  const formChangeHandle = (e) => {
    const { value, name } = e.target;

    setAccountFormat({
      ...accountFormat,
      [name]: value
    });
  };

  const formSubmit = () => {
    ipcRenderer.send('main/createAccount', accountFormat);

    setAccountFormVisible(false);
    
    formClear();
  };

  const formUpdateToggle = (selectId) => {
    // const { id, siteNameKr, siteNameEng, siteUrl, accountId, accountPwd, group } = accountList.filter((v) => v.id === selectId)[0];

    // setAccountFormat({
    //   ...accountFormat,
    //   id,
    //   siteNameKr,
    //   siteNameEng,
    //   siteUrl,
    //   accountId,
    //   accountPwd,
    //   group,
    // });

    // setAccountFormVisible({
    //   visible: true,
    //   update: true
    // });
  };

  const formUpdateSubmit = () => {
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

      if (success) {
        const { data } = result;
        setAccountFormat(data);
      } else {
        message.error(result.log);
      }
    });
  }, []);

  const { siteNameKr, siteNameEng, siteUrl, accountId, accountPwd } = accountFormat;
  return (
    <Modal
        title={update ? '계정 정보 수정' : '계정 정보 등록'}
        centered
        visible={visible}
        onOk={() => update ? formUpdateSubmit() : formSubmit()}
        onCancel={modalClosed}
        width={1000}
      >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" size="large">
        <Form.Item label="사이트 한글 이름">
          <Input name="siteNameKr" value={siteNameKr} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="사이트 영문 이름">
          <Input name="siteNameEng" value={siteNameEng} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="사이트 URL">
          <Input name="siteUrl" value={siteUrl} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="계정 ID">
          <Input name="accountId" value={accountId} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
        <Form.Item label="계정 PW">
          <Input name="accountPwd" value={accountPwd} onChange={(e) => formChangeHandle(e)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AccountForm;
