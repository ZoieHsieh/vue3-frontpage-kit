import axios, { AxiosInstance } from 'axios';

const VITE_BASE_API = import.meta.env.VITE_BASE_API || 'https://test-psi.shopinn.tw/handy-mainpage-editor';

const service: AxiosInstance = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 10000, // 請求超時時間
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});

// 請求攔截器
service.interceptors.request.use(
  (config) => {
    // 無需 Token，直接返回配置
    return config;
  },
  (error) => Promise.reject(error)
);

// 響應攔截器
service.interceptors.response.use(
  (response) => response.data, // 只返回數據部分
  (error) => Promise.reject(error.response || error)
);

export default service;
