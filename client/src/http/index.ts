import storage from "@/utils/storage";
import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9211",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const store = (storage.get("token"))
    if (store && config.headers) {
      config.headers.Authorization = `Bearer ${store}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
