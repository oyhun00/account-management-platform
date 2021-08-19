import React, { useEffect, Suspense } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import useStores from '../../../Stores/UseStore';
import { Layout, Row, Col, Empty, Button } from 'antd';
import CreateAccountCard from './CreateAccountCard';
import LinkedAccountForm from './Form/linkedAccountFrom';
import AccountForm from './Form/AccountForm';
import AccountCard from './AccountCard';
import Loading from '../../Layout/Content/Util/Loading';

const { Content } = Layout;

const ContentBox = observer(() => {
  const { AccountStore, GroupStore, LinkedAccountStore } = useStores();
  const { 
    getAccountList, accountList, getAccountDetail,
    removeAccount, accountFormOption, toggleCreateAccount
   } = AccountStore;
  const { selectedGroup, groupList } = GroupStore;
  const {
    getLinkedAccountList, linkedAccountList,
    toggleCreateLinkedAccount, formOption
  } = LinkedAccountStore;
  
  useEffect(() => {
    getAccountList();
    getLinkedAccountList();
  }, [getAccountList, getLinkedAccountList, selectedGroup]);

  const accountFilteredData = selectedGroup !== 0
  ? accountList.reduce((acc, cur) => {
    if(cur.group === selectedGroup) acc.push(
      <Col key={cur.id} xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
        <AccountCard
          data={cur}
          selectedGroup={selectedGroup}
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
          selectedGroup={selectedGroup}
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
      <AccountForm accountFormOption={accountFormOption}></AccountForm>
      <LinkedAccountForm formOption={formOption}></LinkedAccountForm>
    </Suspense>
  );
});

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
