import React from 'react';
import { Modal, Menu, Layout } from 'antd';

const { Content, Sider } = Layout;

const Setting = (props) => {
  const { SettingVisible, setSettingVisible } = props;

  return (
    <Modal
        title="환경 설정"
        centered
        visible={SettingVisible}
        onOk={() => setSettingVisible(false)}
        onCancel={() => setSettingVisible(false)}
        width={1000}
      >
      <Sider>
        <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <Menu.Item key="1">
              Option 1
            </Menu.Item>
            <Menu.Item key="2">
              Option 2
            </Menu.Item>
            <Menu.Item key="3">
              Option 3
            </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content>sd</Content>
      </Layout>
    </Modal>
  )
};

export default Setting;