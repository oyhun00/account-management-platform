import React from 'react';
import AccountForm from '../Form/AccountForm';
import LinkedAccountForm from '../Form/LinkedAccountFrom';
import Setting from '../Setting';

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