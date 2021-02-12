import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, Row, Col, Empty, Modal } from 'antd';
import AccountCard from './AccountCard';
import CreateAccountCard from './CreateAccountCard';
import AccountForm from './Form/AccountForm';

const { ipcRenderer } = window;
const { Content } = Layout;

const ContentBox = ({ selectGroup }) => {
  const [modalVisible, setModalVisible] = useState({
    visible: false,
    update: false
  });
  const [accountList, setAccountList] = useState([]);
  const [accountFormat, setAccountFormat] = useState({
    siteNameKr: '',
    siteNameEng: '',
    siteUrl: '',
    siteIcon: '',
    accountId: '',
    accountPwd: '',
    linkedId: '',
  });

  const { visible, update } = modalVisible;

  useEffect(() => {
    ipcRenderer.send('main/getAccount');
    ipcRenderer.on('main/getAccount', (e, arg) => {
      setAccountList(arg);
    });
  }, []);

  const accountData = accountList.reduce((acc, cur) => {
    if(cur.group === selectGroup) acc.push(
      <Col key={cur.id} xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
        <AccountCard data={cur} />
      </Col>
    );
    return acc;
  }, []);

  return (
    <CustomContent>
      {
        accountData.length !== 0
          ? (
            <Row>
              {accountData}
              <Col
                xl={{ span: 6 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
                onClick={() => setModalVisible({
                  ...modalVisible,
                  visible: !visible
                })}>
                <CreateAccountCard/>
              </Col>
            </Row> 
          )
          : (
            <EmptyWrap>
              <CustomEmpty />
            </EmptyWrap>
          )
      }
      <Modal
        title={update ? '계정 정보 수정' : '계정 정보 등록'}
        centered
        visible={visible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={1000}
      >
        <AccountForm groupId={selectGroup} setAccountFormat={setAccountFormat} />
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
