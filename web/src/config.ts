export const applicationName = "Business Continuity Planning Portal";

export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";

import { production, development } from "../auth-config.json";
let config = production;
if (window.location.host == "localhost:8080") config = development;
export const authConfig = config;
