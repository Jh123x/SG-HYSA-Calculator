import React from "react";
import ReactDOM, { Container } from "react-dom/client";
import { App } from "./App";

const rootElem = document.getElementById("root");
const root = ReactDOM.createRoot(rootElem as Container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
