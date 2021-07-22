import React, { useEffect, Suspense, lazy } from 'react';
import styled from 'styled-components';
import useStores from '../../../Stores/UseStore';
import { Layout, Row, Col, Empty, Button } from 'antd';
import CreateAccountCard from './CreateAccountCard';
import AccountFrom from './Form/AccountForm';
import AccountCard from './AccountCard';
import Loading from '../../Layout/Content/Util/Loading';

const { ipcRenderer } = window;
const { Content } = Layout;

const ContentBox = (props) => {
  const { selectedGroup, groupList } = props;
  const { AccountStore } = useStores();
  const { 
    getAccountList, accountList, linkedAccountList, removeAccount,
    getAccountDetail, accountFormOption, toggleCreateAccount
   } = AccountStore;

  useEffect(() => {
    getAccountList();
  }, [accountList, linkedAccountList]);

  const accountFilteredData = selectedGroup !== 0
    ? accountList.reduce((acc, cur) => {
      if(cur.group === selectedGroup) acc.push(
        <Col key={cur.id} xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
          <AccountCard
            data={cur}
            removeAccount={removeAccount}
            formUpdateToggle={getAccountDetail} />
        </Col>
      );

      return acc;
    }, [])
    : linkedAccountList.reduce((acc, cur) => {
      acc.push(
        <Col key={cur.id} xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
          <AccountCard
            data={cur}
          />
        </Col>
      )
      return acc;
    }, []);

  return (
    <Suspense fallback={<Loading/>}>
      <CustomContent>
        {
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
                onClick={toggleCreateAccount}>
                  <CreateAccountCard/>
              </Col>
            </Row> 
          )
          : (
            <EmptyWrap>
              <CustomEmpty>
                {
                  groupList.length !== 0
                    ? (
                      <Button
                        type="primary"
                        onClick={toggleCreateAccount}
                      >
                        계정 정보 등록
                      </Button>
                    ) : (
                      <Button disabled>
                        그룹을 등록하세요.
                      </Button>
                    )
                }
              </CustomEmpty>
            </EmptyWrap>
          )
        }
      </CustomContent>
      <AccountFrom accountFormOption={accountFormOption}></AccountFrom>
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
