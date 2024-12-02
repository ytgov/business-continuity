import { createAuth0 } from "@auth0/auth0-vue";
import { authConfig, environment } from "@/config";

// See https://auth0.github.io/auth0-vue/#md:add-login-to-your-application
export default createAuth0({
  domain: authConfig.domain,
  clientId: authConfig.client_id,
  authorizationParams: {
    audience: authConfig.audience,
    redirect_uri: window.location.origin,
  },
  cacheLocation: environment === "development" ? "localstorage" : "memory",
});

//export default config;
