import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import Stores from './Stores';

ReactDOM.render(
  <Provider
    AccountStore={Stores.AccountStore}
  >
    <App />
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
