import debug from "debug";
import * as userAPI from "./users-api";

const log = debug("pern:utilities:user-service");

export function getToken() {
  // getItem returns null if there's no string
  const token = localStorage.getItem("token");
  if (!token) return null;
  // Obtain the payload of the token
  const payload = JSON.parse(atob(token.split(".")[1]));
  // A JWT's exp is expressed in seconds, not milliseconds, so convert
  if (payload.exp < Date.now() / 1000) {
    // Token has expired - remove it from localStorage
    localStorage.removeItem("token");
    return null;
  }
  return token;
}

export function getUser() {
  const token = getToken();
  // If there's a token, return the user in the payload, otherwise return null
  return token ? JSON.parse(atob(token.split(".")[1])).user : null;
}

export const signUp = async (userData) => {
  log("formData: %o", userData);

  const token = await userAPI.signUp(userData);
  log("token: %o", token);

  localStorage.setItem("token", token); // go to inspect >> application >> Local storage, look out key:value pair for the token. This only works for UI (not bruno)
  return getUser();
};

export const login = async (userData) => {
  log("formData: %o", userData);

  const token = await userAPI.login(userData);
  log("token: %o", token);

  localStorage.setItem("token", token); // go to inspect >> application >> Local storage, look out key:value pair for the token. This only works for UI (not bruno)
  return getUser();
};

export function logOut() {
  localStorage.removeItem("token");
}

export const listAllProjects = async () => {
  return await userAPI.listAllProjects();
}

export const listUserProjects = async (userData) => {
  log("userName: %o", userData);
  return await userAPI.listUserProjects(userData);
}

export const listAllTasks = async () => {
  return await userAPI.listAllTasks();
}

export const editSingleTask = async (taskData) => {
  return await userAPI.editSingleTask(taskData);
}

export const deleteSingleTask = async (taskId) => {
  return await userAPI.deleteSingleTask(taskId);
}

export const createSingleTask = async (taskData) => {
  return await userAPI.createSingleTask(taskData);
}