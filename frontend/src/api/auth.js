// src/api/auth.js
import API from "./axios";

// Register new user
export const registerUser = async ({ name, password }) => {
  const res = await API.post("/auth/register", { name, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.user?.name || res.data.team?.name || name);
    localStorage.setItem("teamName", res.data.user?.name || res.data.team?.name || name);
  }
  return res.data;
};

// Login user
export const loginUser = async ({ name, password }) => {
  const res = await API.post("/auth/login", { name, password });
  const { token, user, team } = res.data;
  const username = user?.name || team?.name || name;
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("teamName", username);
  }
  return res.data;
};

// Backwards compatibility aliases
export const registerTeam = registerUser;
export const loginTeam = loginUser;
