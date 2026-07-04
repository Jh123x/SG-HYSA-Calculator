import { StrictMode } from "react";
import { createRoot, type Container } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { App } from "./App";
import { MobileProvider } from "./hooks/useMobile";

const rootElem = document.getElementById("root");
const root = createRoot(rootElem as Container);
root.render(
  <StrictMode>
    <HelmetProvider>
      <MobileProvider>
        <App />
      </MobileProvider>
    </HelmetProvider>
  </StrictMode>,
);
