import React, { useState, useEffect } from 'react';
import AccountList from './AccountList';

const Account = () => {
  const [value, setValue] = useState([]);

  const handleChange = (e) => {
    let file = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = () => {
      setValue(JSON.parse(fileReader.result));
    };
    fileReader.readAsText(file);
  }

  useEffect(() => {
    console.log('렌더링이 완료되었습니다!');
  }, [value]);

  const tempData = value.map((v) => (<AccountList data={v} key={v.id} />));

  return (
    <div>
      <input type="file" onChange={handleChange.bind(this)} />
      <table>
        <thead>
            <tr>
              <th>id</th>
              <th>사이트</th>
              <th>URL</th>
              <th>계정 ID</th>
              <th>계정 비밀번호</th>
            </tr>
          </thead>
          <tbody>
            {tempData}
          </tbody>
      </table>
    </div>
  );
}

export default Account;
