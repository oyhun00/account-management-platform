import React, { lazy } from 'react';
const AccountForm = lazy(() => import('../Form/AccountForm'));

const Util = (props) => {
  const { selectGroup, accountFormVisible, setAccountFormVisible } = props;
  
  return (
    <AccountForm
      selectGroup={selectGroup}
      accountFormVisible={accountFormVisible}
      setAccountFormVisible={setAccountFormVisible}
    />
  )
};

export default Util;