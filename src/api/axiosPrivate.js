// src/api/axiosPrivate.js
import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Adjust this if needed
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // If you are using cookies (optional)
});

// Intercept every request to attach token
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosPrivate;
