import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, Row, Col, Empty, Modal } from 'antd';
import AccountCard from './AccountCard';
import CreateAccountCard from './CreateAccountCard';
import AccountForm from './Form/AccountForm';
import AccountList from '../../../TempData/AccountList.json';
const { ipcRenderer } = window;


const { Content } = Layout;

const ContentBox = ({ data }) => {
  const { selectGorup } = data;
  const filteredData = AccountList.filter((v) => v.group === selectGorup );
  const accountData = filteredData.map((v) => (
    <Col key={v.id} xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
      <AccountCard data={v} />
    </Col>
  ));

  const test = () => {
    ipcRenderer.send('foo', {
      name: 'hi'
    })
    // window.ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg); 
    // });
    // window.ipcRenderer.send('asynchronous-message', 'ping');
  }

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <CustomContent>
      {
        accountData.length !== 0
          ? (
            <Row>
              {accountData}
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} onClick={() => setModalVisible(!modalVisible)}>
                <CreateAccountCard/>
              </Col>
            </Row> 
          )
          : (
            <EmptyWrap>
              <CustomEmpty onClick={test} />
            </EmptyWrap>
          )
      }
      <Modal
        title="Modal 1000px width"
        centered
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={1000}
      >
        <AccountForm groupId={selectGorup} />
      </Modal>
    </CustomContent>
  );
}

const CustomContent = styled(Content)`
  padding: 12px;
  color: #fff;
`;

const EmptyWrap = styled.div`
  display: table;
  height: 100%;
  width: 100%;
  color: rgba(255, 255, 255, 0.65);
`;

const CustomEmpty = styled(Empty)`
  display: table-cell;
  vertical-align: middle;
  height: 100%;
`;

export default ContentBox;
