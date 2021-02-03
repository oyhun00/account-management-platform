import React from 'react';
import styled from 'styled-components';
import { Form, Input, Modal } from 'antd';

const AccountForm = ({ groupId }) => {
  return (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" size="large">
      <Form.Item label="사이트 한글 이름">
        <Input />
      </Form.Item>
      <Form.Item label="사이트 영문 이름">
        <Input />
      </Form.Item>
      <Form.Item label="사이트 URL">
        <Input />
      </Form.Item>
      <Form.Item label="계정 ID">
        <Input />
      </Form.Item>
      <Form.Item label="계정 PW">
        <Input />
      </Form.Item>
    </Form>
  );
}

export default AccountForm;
