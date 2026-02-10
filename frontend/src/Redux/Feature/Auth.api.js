import API from "./Api";

export const loginUserApi = (credentials) => {
  return API.post("/User/login", credentials);
};

export const registerUserApi = (userData) => {
  return API.post("/User/register", userData);
};
