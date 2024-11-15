import React from 'react';
import ReactDOM, { Container } from 'react-dom/client';
import { App } from './App.tsx';
import reportWebVitals from './reportWebVitals.ts';

const rootElem = document.getElementById('root');
const root = ReactDOM.createRoot(rootElem as Container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
