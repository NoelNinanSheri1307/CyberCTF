import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor for handling 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPath =
        error.config.url.includes("/auth/login") ||
        error.config.url.includes("/auth/register");

      if (!isAuthPath) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("teamName");
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/register" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
