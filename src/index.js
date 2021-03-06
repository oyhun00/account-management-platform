import React, { Suspense } from 'react';
import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import Stores from './Stores';

ReactDOM.render(
  <Provider
    AccountStore={Stores.AccountStore}
    GroupStore={Stores.GroupStore}
  >
    <Suspense fallback={<div>Loading... </div>}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
