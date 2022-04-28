import { Suspense } from 'react';
import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import App from './App';
import Stores from './Stores';

ReactDOM.render(
  <Provider
    LinkedAccountStore={Stores.LinkedAccountStore}
    AccountStore={Stores.AccountStore}
    GroupStore={Stores.GroupStore}
    UtilStore={Stores.UtilStore}
  >
    <Suspense fallback={<div>Loading... </div>}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById('root'),
);
