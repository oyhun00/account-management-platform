import { useMemo, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import {
  Layout, Row, Col, Empty, Button,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useStores from '../../../Stores/UseStore';
import CreateAccountCard from './CreateAccountCard';
import LinkedAccountForm from './Form/linkedAccountFrom';
import AccountForm from './Form/AccountForm';
import AccountCard from './AccountCard';

const { Content } = Layout;

const ContentBox = observer(() => {
  const { AccountStore, GroupStore, LinkedAccountStore } = useStores();
  const {
    getAccountList, accountList,
    accountFormOption, toggleCreateAccount,
  } = AccountStore;
  const { selectedGroup } = GroupStore;
  const {
    getLinkedAccountList, linkedAccountList,
    toggleCreateLinkedAccount, formOption,
  } = LinkedAccountStore;

  const accountFiltering = useCallback(() => {
    if (selectedGroup !== 0) {
      return accountList.reduce((acc, cur) => {
        if (cur.group === selectedGroup) {
          acc.push(
            <Col
              key={cur.id}
              xl={{ span: 6 }}
              lg={{ span: 8 }}
              md={{ span: 12 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <AccountCard
                data={cur}
                linkedAccountList={linkedAccountList}
              />
            </Col>,
          );
        }
        return acc;
      }, []);
    }

    return linkedAccountList.reduce((acc, cur) => {
      acc.push(
        <Col
          key={cur.id}
          xl={{ span: 6 }}
          lg={{ span: 8 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <AccountCard
            selectedGroup={selectedGroup}
            data={cur}
          />
        </Col>,
      );
      return acc;
    }, []);
  }, [accountList, linkedAccountList, selectedGroup]);

  const accountFilteredData = useMemo(
    () => accountFiltering(selectedGroup),
    [accountFiltering, selectedGroup],
  );

  useEffect(() => {
    getAccountList();
    getLinkedAccountList();
  }, [getAccountList, getLinkedAccountList]);

  return (
    <>
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
                  onClick={selectedGroup ? toggleCreateAccount : toggleCreateLinkedAccount}
                >
                  <CreateAccountCard />
                </Col>
              </Row>
            )
            : (
              <EmptyWrap>
                <CustomEmpty>
                  <CustomButton
                    type="primary"
                    shape="round"
                    onClick={selectedGroup ? toggleCreateAccount : toggleCreateLinkedAccount}
                  >
                    <PlusOutlined />
                    { selectedGroup ? '계정 정보 등록' : '연동 계정 등록' }
                  </CustomButton>
                </CustomEmpty>
              </EmptyWrap>
            )
        }
      </CustomContent>
      <AccountForm
        accountFormOption={accountFormOption}
        linkedAccountList={linkedAccountList}
      />
      <LinkedAccountForm
        formOption={formOption}
      />
    </>
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

const CustomButton = styled(Button)`
  border: 0;
  background: linear-gradient(45deg, #3b9c78, #2278ab, #7022ab);
  padding: 4px 26px;

  :hover, :active, :focus {
    background: linear-gradient(45deg,#3b9c78,#2298ab,#c81ddc);
  }
`;

export default ContentBox;
