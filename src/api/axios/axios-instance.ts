import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { useEnv } from "@/hooks";
import { AxiosLoading } from "./loading";
import Cookies from "js-cookie";

const axiosLoading = new AxiosLoading();
const { VITE_BASE_API } = useEnv();

const service: AxiosInstance = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 10 * 1000, // 请求超时时间
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["x-access-token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    axiosLoading.addLoading();
    return config;
  },
  (error: any) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    axiosLoading.closeLoading();
    const data = response.data;
    return data;
  },
  (err) => {
    axiosLoading.closeLoading();
    return Promise.reject(err.response);
  }
);

class Request {
  path: string;
  constructor(path: string) {
    this.path = path;
  }
  /**
   * get
   */
  get<T = any>(url: string = "", data?: any): Promise<T> {
    let filteredQuery = {};
    if (data) {
      filteredQuery = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(data).filter(
          ([key, value]) => value !== null && value !== ""
        )
      );
    }
    const queryString = new URLSearchParams(filteredQuery).toString();
    const queryUrl = `${url}?${queryString}`;
    return this.request("GET", queryUrl, filteredQuery);
  }
  /**
   * post
   */
  post<T = any>(url: string = "", data?: any): Promise<T> {
    return this.request("POST", url, { data });
  }
  /**
   * put
   */
  put<T = any>(url: string = "", data?: any): Promise<T> {
    return this.request("PUT", url, { data });
  }
  /**
   * patch
   */
  patch<T = any>(url: string = "", data?: any): Promise<T> {
    return this.request("PATCH", url, { data });
  }
  /**
   * delete
   */
  delete<T = any>(url: string = "", data?: any): Promise<T> {
    return this.request("DELETE", url, { params: data });
  }
  /**
   * request
   */
  request<T = any>(method = "GET", id: string = "", data?: any): Promise<T> {
    const url = `${this.path}/${id}`;

    return new Promise((resolve, reject) => {
      service({ method, url, ...data })
        .then((res) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError | any) => {
          reject(e.data);
        });
    });
  }
}

export default Request;
