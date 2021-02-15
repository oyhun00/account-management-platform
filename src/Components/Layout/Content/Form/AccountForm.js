import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Form, Input, Modal } from 'antd';

const AccountForm = (props) => {
  const { accountFormat, formChangeHandle } = props;
  const { siteNameKr, siteNameEng, siteUrl, accountId, accountPwd } = accountFormat;

  useEffect(() => {
    console.log("Asd");
  }, [accountFormat]);

  return (
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
  );
}

export default AccountForm;
