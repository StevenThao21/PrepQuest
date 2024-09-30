import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Use the environment variable VITE_API_URL or fallback to http://localhost:8000 if undefined
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:8000',  // Adjust baseURL fallback
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
