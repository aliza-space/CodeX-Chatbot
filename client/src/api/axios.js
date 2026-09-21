import axios from "axios";
import { useAuthStore } from "../store/authStore.js";
import { getApiBaseUrl } from "./apiUrl.js";

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  // Ensure requests made from another Wi-Fi device use the correct host IP
  config.baseURL = getApiBaseUrl();
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;
