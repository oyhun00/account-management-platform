import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import Side from './Layout/Side';
import ContentBox from './Layout/Content';

const { Sider } = Layout;

const MainComponent = () => {
  const [state, setState] = useState({
    collapsed: false,
    add: false,
  });

  const toggleCollapsed = () => {
    const { collapsed, add } = state;

    !collapsed && add
      ? setState({
          collapsed: !collapsed,
          add: false,
        })
      : setState({
          ...state,
          collapsed: !collapsed,
        });
  };

  const toggleAdded = () => {
    const { collapsed, add } = state;

    collapsed
      ? setState({
          collapsed: !collapsed,
          add: !add,
        })
      : setState({
          ...state,
          add: !state.add,
        });
  };

  return (
    <>
      <CustomSider collapsible collapsed={state.collapsed} onCollapse={toggleCollapsed}>
        <Side data={state} onAddToggle={toggleAdded} />
      </CustomSider>
      <Layout>
        <ContentBox />
      </Layout>
    </>
  );
}

 const CustomSider = styled(Sider)`
  background: #19171d;
  border-right: 1px solid #2a272f;
  box-sizing: content-box;

  .ant-layout-sider-trigger {
    top: 0;
    background: #1f1d23;
  }
`;

export default MainComponent;
