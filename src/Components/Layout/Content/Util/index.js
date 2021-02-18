import React, { lazy, Suspense } from 'react';
const AccountForm = lazy(() => import('../Form/AccountForm'));

const Util = (props) => {
  const { selectGroup, accountFormVisible, setAccountFormVisible } = props;

  return (
    <Suspense fallback={<div>loading...</div>}>
      <AccountForm
        selectGroup={selectGroup}
        accountFormVisible={accountFormVisible}
        setAccountFormVisible={setAccountFormVisible}
      />
    </Suspense>
  )
};

export default Util;