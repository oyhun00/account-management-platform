import React, { lazy } from 'react';

const AccountForm = lazy(() => import('../Form/AccountForm'));
const Setting = lazy(() => import('../Setting'));

const Util = (props) => {
  const {
    selectGroup, accountFormVisible, setAccountFormVisible, SettingVisible, setSettingVisible
  } = props;
  
  return (
    <>
      <AccountForm
        selectGroup={selectGroup}
        accountFormVisible={accountFormVisible}
        setAccountFormVisible={setAccountFormVisible}
      />
      <Setting
        SettingVisible={SettingVisible}
        setSettingVisible={setSettingVisible}
      />
    </>
  )
};

export default Util;