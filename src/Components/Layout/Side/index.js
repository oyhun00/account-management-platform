import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Menu, Input, Row, Col } from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import useStores from '../../../Stores/UseStore';
import MenuItem from './Menu';

const Side = () => {
  const { GroupStore } = useStores();
  const { 
    selectedGroup, isAdd, groupUpdateValue, groupList,
    setSelectedGroup, setAddStatus, getGroupList, addGroup, removeGroup,
    toggleUpdateGroup, updateGroup, onChangeValue
  } = GroupStore;

  useEffect(() => {
    getGroupList();
  }, [groupList, getGroupList]);
  
  const menuItem = groupList.map((v) =>
    (
      <CustomMenuItem key={v.id} onClick={() => setSelectedGroup(v.id)}>
        <MenuItem
          data={v}
          groupUpdateValue={groupUpdateValue}
          onChangeValue={onChangeValue}
          updateGroup={updateGroup}
          toggleUpdateGroup={toggleUpdateGroup}
          removeGroup={removeGroup}
        />
      </CustomMenuItem>
    )
  );
  
  return (
    <CustomSider>
      <CustomMenu defaultSelectedKeys={[selectedGroup.toString()]} defaultOpenKeys={[`sub${selectedGroup.toString()}`]} selectedKeys={[selectedGroup.toString()]} mode="inline" theme="dark">
        {menuItem}
      </CustomMenu>
      {
        isAdd
          ? (
            <CustomRow>
              <Col span={20}>
                <CustomInput onChange={onChangeValue}/>
              </Col>
              <CustomPlusIconWrap span={4} onClick={addGroup} >
                <PlusOutlined/>
              </CustomPlusIconWrap>
            </CustomRow>
          )
          : ''
      }
      <CustomRow>
        <CustomPlusIconWrap onClick={() => setAddStatus(!isAdd)}>
          {
            isAdd
              ? (
                <>
                  <CloseOutlined/>
                </>
              )
              : (
                <>
                  <CustomPlusOutlined/>
                  <AddComment>그룹 추가</AddComment>
                </>
              )
          }
        </CustomPlusIconWrap>
      </CustomRow>
      <CustomFixedRow>
        <CustomLinkOutlined onClick={() => setSelectedGroup(0)} />
      </CustomFixedRow>
    </CustomSider>
  );
}

const CustomSider = styled.div`
  position: relative;
  background: #19171d;
  color: rgba(255, 255, 255, 0.65);
  height: 100%;
`;

const CustomMenu = styled(Menu)`
  background: #19171d !important;
  overflow: auto;
  max-height: calc(100% - 80px);

  & .ant-menu-item-selected {
    background-color: #242229 !important;
  }
`;

const CustomMenuItem = styled(Menu.Item)`
  background-color: #19171d;
`;

const CustomRow = styled(Row)`
  padding: 0 16px 0 24px;
  height: 30px;
  line-height: 40px;
`;

const CustomPlusIconWrap = styled(Col)`
  text-align: center;
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

const CustomPlusOutlined = styled(PlusOutlined)`
  background: #332f3c;
  padding: 4px;
  border-radius: 3px;

  & > svg { 
    width: 0.9em;
    height: 0.9em;
  }
`;

const AddComment = styled.span`
  margin-left: 8px;
`;

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

const CustomFixedRow = styled(Row)`
  position: fixed;
  bottom: 0;  
  padding: 15px 16px 15px 24px;
`;

const CustomLinkOutlined = styled(LinkOutlined)`
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

export default observer(Side);
