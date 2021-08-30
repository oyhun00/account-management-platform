import React, { Suspense } from 'react';
import { observer } from 'mobx-react';
import useStores from '../../../Stores/UseStore';
import styled from 'styled-components';
import { Card, Avatar, Row, Divider, Popover, List, Button } from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Loading from './Util/Loading';

const AccountCard = observer(({ data, linkedAccountList, selectedGroup }) => {
  const { id, siteNameKr, siteNameEng, siteUrl, siteIcon, accountId, accountPwd, linkId } = data;
  const { AccountStore, LinkedAccountStore } = useStores();
  const { removeAccount, getAccountDetail } = AccountStore;
  const { getLinkedAccountDetail, removeLinkedAccount } = LinkedAccountStore;
  const isLink = selectedGroup === 0 ? true : false;
  const filteredLink = linkId ? linkedAccountList.filter((v) => v.id === linkId)[0] : '';
  
  const popMenu = (
    <>
      <CustomList onClick={() => isLink ? getLinkedAccountDetail(id) : getAccountDetail(id)}>수정<EditOutlined /></CustomList>
      <CustomList onClick={() => isLink ? removeLinkedAccount(id) : removeAccount(id)}>삭제<DeleteOutlined /></CustomList>
    </>
  );

  return (
    <Suspense fallback={<Loading/>}>
      <CustomCard>
        <CustomRow>
          <CustomAvatar src={siteIcon} />
          <PropWrap>
            <SiteName>
              <span>{siteNameKr}</span>
              <span>{siteNameEng}</span>
            </SiteName>
            <SiteUrl>{siteUrl}</SiteUrl>
          </PropWrap>
        </CustomRow>
        <CustomDivider />
        <CustomRow>
          { isLink ? '' : <CustomAvatar src={!linkId ? siteIcon : filteredLink.siteIcon} /> }
          <PropWrap isIcon={isLink}>
            <AccountRow>
              <Title>ID</Title>
              <span>{!linkId ? accountId : filteredLink.accountId}</span>
            </AccountRow>
            <AccountRow>
              <Title>PW</Title>
              <span>{!linkId ? accountPwd : filteredLink.accountPwd}</span>
            </AccountRow>
          </PropWrap>
        </CustomRow>
        <Popover content={popMenu} trigger="focus">
          <ActionButton>
            <MoreOutlined />
          </ActionButton>
        </Popover>
      </CustomCard>
    </Suspense>
  );
});

const CustomCard = styled(Card)`
  margin: 12px;
  color: #fff;
  background: #1a1d21;
  border: 1px solid #3f3f3f;
  color: rgba(255, 255, 255, 0.65);

  & p {
    margin-bottom: 0;
  }
`;

const CustomRow = styled(Row)`
  align-items: center;
  flex-flow: row nowrap;

  &:first-child {
    margin-bottom: 12px;
  }
`;

const AccountRow = styled(Row)`
  flex-flow: row nowrap;

  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CustomAvatar = styled(Avatar)`
  min-width: 32px;
  height: 32px;
  user-select: none;
`;

const PropWrap = styled.div`
  margin-left: ${(props) => (props.isIcon ? '0px' : '18px')};
  overflow: hidden;
`;

const SiteName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  & span {
    font-size: 14px;
    font-weight: 500;
    color: #3574b0;
  }

  & span:first-child {
    margin-right: 5px;
    font-size: 16px;
    color: #4694df;
  }
`;

const SiteUrl = styled.div`
  font-size: 11px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Title = styled.span`
  margin-right: 10px;
  color: #fff;
  font-weight: 500;
`;

const ActionButton = styled(Button)`
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;
  background: 0;
  border: 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.65);

  &:hover, &:focus, &:active {
    opacity: 0.7;
    background: 0;
    border: 0;
    box-shadow: none;
  }
`;

const CustomDivider = styled(Divider)`
  margin: 12px 0;
  border-top: 1px solid rgb(63 63 63);
`;

const CustomList = styled(List)`
  &:not(:last-child) .ant-spin-container {
    margin-bottom: 6px;
  }

  & .ant-spin-container {
    cursor: pointer;
    font-size: 12px;
    color: #000;

    & span {
      margin-left: 19px;
    }
  }

  &:hover {
    opacity: 0.8;
  }
`;

export default AccountCard;
