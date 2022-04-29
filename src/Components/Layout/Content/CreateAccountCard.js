import styled from 'styled-components';
import { Card } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

const AccountCard = () => (
  <CustomCard>
    <CustomPlusOutlined style={{ fontSize: '32px', color: '#fff' }} />
  </CustomCard>
);

const CustomCard = styled(Card)`
  margin: 12px;
  color: #fff;
  background: #25282c;
  border: 1px dashed #686868;
  height: calc(100% - 24px);
  cursor: pointer;
  transition: 0.5s;

  & .ant-card-body {
    display: flex;
    height: 100%;
    text-align: center;
  }

  &:hover {
    opacity: 0.7;
    background: #35393d;
  }
`;

const CustomPlusOutlined = styled(PlusOutlined)`
  text-align: center;
  margin: 0 auto;
  align-self: center;
`;

export default AccountCard;
