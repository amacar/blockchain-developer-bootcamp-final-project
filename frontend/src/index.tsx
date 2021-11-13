import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChainId, Config, DAppProvider } from "@usedapp/core";

const config: Config = { supportedChains: [ChainId.Rinkeby] };

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
