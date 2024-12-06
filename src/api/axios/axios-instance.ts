import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

const VITE_BASE_API = import.meta.env.VITE_BASE_API || 'https://default-base-url.com';

const service: AxiosInstance = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 10 * 1000, // 請求超時時間
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可在此添加 token 或其他通用請求邏輯
    return config;
  },
  (error: AxiosError) => {
    // 處理請求錯誤
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 處理響應數據
    return response.data;
  },
  (error) => {
    // 修改以確保返回錯誤本身如果沒有 response
    return Promise.reject(error.response || error);
  }
);

export default service;
