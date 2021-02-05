import React from 'react';
import styled from 'styled-components';
import { Card, Avatar, Row, Divider, Popover, List } from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import AccountLinkage from '../../../TempData/AccountLinkage.json';

const popMenu = (
  <>
    <List>수정<EditOutlined /></List>
    <List>삭제<DeleteOutlined /></List>
  </>
);

const AccountCard = ({ data }) => {
  const { siteNameKr, siteNameEng, siteUrl, siteIcon, accountId, accountPwd, linkedId } = data;
  const LinkedFavicon = linkedId ? AccountLinkage.filter((v) => v.id === linkedId ) : '';
  console.log(LinkedFavicon);
  return (
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
        { LinkedFavicon ? <CustomAvatar src={LinkedFavicon[0].favicon} /> : <CustomAvatar src={siteIcon} /> }
        <PropWrap>
          <AccountRow>
            <Title>ID</Title>
            <span>{accountId}</span>
          </AccountRow>
          <AccountRow>
            <Title>PW</Title>
            <span>{accountPwd}</span>
          </AccountRow>
        </PropWrap>
      </CustomRow>
      <Popover content={popMenu} trigger="click">
        <ActionButton />
      </Popover>
    </CustomCard>
  );
}

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
  }
`;

const CustomAvatar = styled(Avatar)`
  min-width: 32px;
  height: 32px;
`;

const PropWrap = styled.div`
  margin-left: 18px;
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
`;

const Title = styled.span`
  margin-right: 10px;
  color: #fff;
  font-weight: 500;
`;

const ActionButton = styled(MoreOutlined)`
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const CustomDivider = styled(Divider)`
  margin: 12px 0;
  border-top: 1px solid rgb(63 63 63);
`;

const CustomList = styled(List)`
  & .ant-spin-container {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.65);
  }

  &:hover {
    opacity: 0.8;
  }
`;

export default AccountCard;
