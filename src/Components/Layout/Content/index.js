import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, Row, Col, Empty, message } from 'antd';
import AccountCard from './AccountCard';
import CreateAccountCard from './CreateAccountCard';

const { ipcRenderer } = window;
const { Content } = Layout;

const ContentBox = (props) => {
  const { selectGroup, setAccountFormVisible } = props;
  const [accountList, setAccountList] = useState([]);
  
  const formUpdateToggle = (id) => {
    ipcRenderer.send('main/getAccountDetail', id);

    setAccountFormVisible({
      update: true,
      visible: true
    })
  };

  const removeAccount = (id) => {
    ipcRenderer.send('main/removeAccount', id);
  };

  useEffect(() => {
    ipcRenderer.send('main/getAccount');
    ipcRenderer.on('main/getAccount', (e, result) => {
      const { success } = result;

      if (success) {
        const { data, log } = result;
        setAccountList(data);

        if (log) {
          message.success(log);
        }
      } else {
        message.error(result.log);
      }
    });
  }, []);

  const accountData = accountList.reduce((acc, cur) => {
    if(cur.group === selectGroup) acc.push(
      <Col key={cur.id} xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
        <AccountCard
          data={cur}
          removeAccount={removeAccount}
          formUpdateToggle={formUpdateToggle} />
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
                onClick={() => setAccountFormVisible({
                  update: false,
                  visible: true
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
