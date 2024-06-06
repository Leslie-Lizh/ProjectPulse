import debug from "debug";
import sendRequest from "./users-request";

const log = debug("pern:utilities:users-api"); // eslint-disable-line no-unused-vars
// Add the following import
const BASE_URL = "/api/users";

// Refactored code below
export function signUp(userData) {
  return sendRequest(BASE_URL, "POST", userData);
}

export function login(credentials) {
  return sendRequest(`${BASE_URL}/login`, "POST", credentials);
}

export function listAllProjects() {
  return sendRequest(`${BASE_URL}/admin/projects`);
}

export function listUserProjects(userName) {
  return sendRequest(`${BASE_URL}/${userName}/projects`);
}