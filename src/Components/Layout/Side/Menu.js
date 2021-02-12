import React from 'react';
import styled from 'styled-components';
import { Input, Row, Col } from 'antd';
import {
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';

const MenuItem = (props) => {
  const { data, updateValue, updateChangeHandle, updateMenuSubmit, updateMenuToggle, removeMenu, onGroupSelect } = props;
  const { id, menuName, updateStatus } = data;

  return (
    <>
      {updateStatus
        ? (
          <Row>
            <Col span={16}>
              <CustomInput value={updateValue} onChange={updateChangeHandle} />
            </Col>
            <Col span={8}>
              <CheckOutlined onClick={() => updateMenuSubmit(id)}/>
              <CloseOutlined onClick={() => updateMenuToggle()} />
            </Col>
          </Row>
        )
        : (
          <div onClick={() => onGroupSelect(id)}>
            {menuName}
            <CloseOutlined onClick={(e) => removeMenu(e, id)} />
            <EditOutlined  onClick={(e) => updateMenuToggle(e, id)} />
          </div>
        )}
    </>
  )
}

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

export default MenuItem;
