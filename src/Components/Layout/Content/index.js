import React, { useEffect, useState, Suspense, lazy } from 'react';
import styled from 'styled-components';
import { Layout, Row, Col, Empty, Button, message } from 'antd';
import CreateAccountCard from './CreateAccountCard';
import Loading from '../../Layout/Content/Util/Loading';

const AccountCard = lazy(() => import('./AccountCard'));

const { ipcRenderer } = window;
const { Content } = Layout;

const ContentBox = (props) => {
  const { selectGroup, selectView, setAccountFormVisible } = props;
  const [accountList, setAccountList] = useState([]);
  const [linkedAccountList, setLinkedAccountList] = useState([]);
  
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
    console.log(111);
    ipcRenderer.send('main/getAccount');
    ipcRenderer.on('main/getAccount', (e, result) => {
      const { success, log } = result;

      if (success) {
        const { accountData, linkData } = result;
        console.log(result);
        
        setAccountList(accountData);
        setLinkedAccountList(linkData);

        if (log) {
          message.success(log);
        }
      } else {
        message.error(log);
      }
    });
  }, []);

  const linkageAccount = '';

  const accountFilteredData = accountList.reduce((acc, cur) => {
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
    <Suspense fallback={<Loading/>}>
      <CustomContent>
        {
          selectView
           ? linkageAccount
           : (
             accountFilteredData.length !== 0
              ? (
                <Row>
                  {accountFilteredData}
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
                  <CustomEmpty>
                    <Button
                      type="primary"
                      onClick={() => setAccountFormVisible({
                        update: false,
                        visible: true
                      })}
                    >
                      계정 정보 등록
                    </Button>
                  </CustomEmpty>
                </EmptyWrap>
              )
          )
        }
      </CustomContent>
    </Suspense>
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
