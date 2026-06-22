import { StrictMode } from "react";
import { createRoot, type Container } from "react-dom/client";
import { App } from "./App";
import { MobileProvider } from "./hooks/useMobile";

const rootElem = document.getElementById("root");
const root = createRoot(rootElem as Container);
root.render(
  <StrictMode>
    <MobileProvider>
      <App />
    </MobileProvider>
  </StrictMode>,
);
