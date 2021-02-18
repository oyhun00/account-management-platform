import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import Loading from './Components/Layout/Content/Util/Loading';

ReactDOM.render(
  <Suspense fallback={<Loading/>}>
    <App />
  </Suspense>,
  document.getElementById('root')
);

reportWebVitals();
