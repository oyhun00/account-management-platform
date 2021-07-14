import React from 'react';
import styled from 'styled-components';
import { Input, Popover, Button, List } from 'antd';
import {
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
  MoreOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const MenuItem = (props) => {
  const { data, groupUpdateValue, onChangeValue, updateGroup, toggleUpdateGroup, removeGroup } = props;
  const { id, menuName, updateStatus } = data;

  const popMenu = (
    <>
      <CustomList onClick={(e) => toggleUpdateGroup(e, id)}> 수정<EditOutlined /></CustomList>
      <CustomList onClick={() => removeGroup(id)}>삭제<DeleteOutlined /></CustomList>
    </>
  );

  return (
    <>
      {updateStatus
        ? (
          <FlexBox>
            <div>
              <CustomInput value={groupUpdateValue} onChange={onChangeValue} />
            </div>
            <IconWrap>
              <CheckOutlined onClick={() => updateGroup(id)}/>
              <CloseOutlined onClick={(e) => toggleUpdateGroup(e, id)} />
            </IconWrap>
          </FlexBox>
        )
        : (
          <FlexBox>
            {menuName}
            <Popover content={popMenu} trigger="focus" placement="rightTop">
              <ActionButton>
                <MoreOutlined />
              </ActionButton>
            </Popover>
          </FlexBox>
        )}
    </>
  )
};

const CustomInput = styled(Input)`
  background: rgb(40 39 44);
  border: 1px solid #4a4a4a;
  padding: 1px 11px;
  color: rgba(255, 255, 255, 0.65);

  :focus, :hover {
    border-color: #fff;
    color: #fff;
  }
`;

const IconWrap = styled.div`
  margin-left: 8px; 

  & span:last-child {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ActionButton = styled(Button)`
  cursor: pointer;
  background: 0;
  border: 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.65);

  & > span {
    margin-right: 0 !important;
  }

  &:hover, &:focus, &:active {
    opacity: 0.7;
    background: 0;
    border: 0;
    box-shadow: none;
  }
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
      margin-left: 12px;
    }
  }

  &:hover {
    opacity: 0.8;
  }
`;

export default MenuItem;
