import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Layout } from 'antd';
import Side from './Layout/Side';
import ContentBox from './Layout/Content';
import useStores from '../Stores/UseStore';

const { Sider } = Layout;

const MainComponent = observer(() => {
  const { GroupStore } = useStores();
  const { getFirstGroup } = GroupStore;

  useEffect(() => {
    getFirstGroup();
  }, [getFirstGroup]);

  return (
    <>
      <CustomSider>
        <Side/>
      </CustomSider>
      <CustomMainLayout>
        <ContentBox/>
      </CustomMainLayout>
    </>
  );
});

const CustomSider = styled(Sider)`
  background: #19171d;
  border-right: 1px solid #2a272f;
  box-sizing: content-box;
  height: 100%;
`;

const CustomMainLayout = styled(Layout)`
  overflow: auto;
`;

export default MainComponent;
