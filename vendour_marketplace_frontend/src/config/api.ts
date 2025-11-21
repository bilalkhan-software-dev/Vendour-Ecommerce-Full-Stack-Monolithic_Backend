import axios from "axios";

export const APP_BASE_URL = "http://localhost:8081/api/v1";

export const api = axios.create({
  baseURL: APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor: attach token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized access - perhaps your token is invalid?");
          localStorage.removeItem("jwt");
          window.location.href = "/";
          break;
        case 404:
          console.error("Resource not found");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else {
      console.error("An unexpected error occurred:", error.message);
    }
    return Promise.reject(error);
  }
);
