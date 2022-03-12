import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    clientID={config.clientID}
    redirectUri={window.location.origin}
    responseType={config.responseType}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

