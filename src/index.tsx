import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";

const rootElem = document.getElementById("root");
const root = ReactDOM.createRoot(rootElem as ReactDOM.Container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
