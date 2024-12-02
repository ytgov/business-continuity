import * as config from "./config";

export const LOGIN_URL = `${config.apiBaseUrl}/api/auth/login`;
export const AUTH_CHECK_URL = `${config.apiBaseUrl}/api/auth/isAuthenticated`;
export const LOGOUT_URL = `${config.apiBaseUrl}/api/auth/logout`;
export const PROFILE_URL = `${config.apiBaseUrl}/api/user/me`;

export const USERS_URL = `${config.apiBaseUrl}/api/user`;
export const DIRECTORY_URL = `${config.apiBaseUrl}/api/directory`;

export const DEPARTMENT_URL = `${config.apiBaseUrl}/api/department`;
export const DOCUMENTATION_URL = `${config.apiBaseUrl}/api/documentation`;
export const DOCUMENTS_URL = `${config.apiBaseUrl}/api/public-documents`;
export const DOCUMENTS_AUTH_URL = `${config.apiBaseUrl}/api/documents`;
export const ROLE_URL = "";
