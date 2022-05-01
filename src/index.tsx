import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './index.css';
import { Products } from 'pages/Products';
import * as serviceWorker from './serviceWorker';

Modal.setAppElement('#root');

// TODO: revisit create-react-app latest versions. Check if initial extra rerender still happens. If doesn't happen, then use to git rid of console warning "Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17."

ReactDOM.render(
  <React.StrictMode>
    <Products />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
