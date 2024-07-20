import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import './index.css';
// import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      {/* <ErrorBoundary> */}
        <App />
        <Toaster />
        {/* </ErrorBoundary> */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
