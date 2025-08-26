import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : "/api"; 

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      window.dispatchEvent(new Event("tokenExpired"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
