import React from 'react';

const AccountList = ({ data }) => {
  const {id, siteName, siteUrl, accountId, accountPassword } = data;
  return (
    <tr>
      <td>{id}</td>
      <td>{siteName}</td>
      <td>{siteUrl}</td>
      <td>{accountId}</td>
      <td>{accountPassword}</td>
    </tr>
  )
}

export default AccountList;