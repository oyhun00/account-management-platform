import styled from 'styled-components';
import { Layout } from 'antd';
import MainComponent from './Components';

const App = () => (
  <CustomLayout>
    <MainComponent />
  </CustomLayout>
);

const CustomLayout = styled(Layout)`
  height: 100vh;
  background: #19171d;
  overflow: hidden;

  .ant-layout {
    background: #222529;
  }
`;

export default App;
