import Cookie from 'js-cookie';
import { useApiRequest } from '../../../../src/composables/useApiRequest'; 
const defaultApiRequest = useApiRequest();
class PsiRequest {
  basePath: string;
  apiRequest: any;

  constructor(basePath: string, apiRequest: any = defaultApiRequest) { // 提供默認值
    this.basePath = basePath;
    this.apiRequest = apiRequest;
  }
  // GET 方法
  async get<T = any>(url: string, params?: any): Promise<T> {
    // 檢查 params 是否存在且有有效鍵值
    const queryString = params && Object.keys(params).length > 0
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    const fullUrl = `${this.basePath}${url}${queryString}`;
    const token = Cookie.get('token');

    try {
      const response = await this.apiRequest.myGet(fullUrl, token as string);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || '發生錯誤！');
    }
  }

  // POST 方法
 
  async post<T = any>(url: string, data?: any): Promise<T> {
    const fullUrl = `${this.basePath}${url}`;
    const token = Cookie.get('token');

    try {
      const response = await this.apiRequest.myPost(fullUrl, token as string, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || '發生錯誤！');
    }
  }

  // PUT 方法
  async put<T = any>(url: string, data?: any): Promise<T> {
    const fullUrl = `${this.basePath}/${url}`;
    const token = Cookie.get('token');

    try {
      const response = await this.apiRequest.myPut(fullUrl, token as string, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || '發生錯誤！');
    }
  }

  // PATCH 方法
  async patch<T = any>(url: string, data?: any): Promise<T> {
    const fullUrl = `${this.basePath}/${url}`;
    const token = Cookie.get('token');

    try {
      const response = await this.apiRequest.myPatch(fullUrl, token as string, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || '發生錯誤！');
    }
  }

  // DELETE 方法
  async delete<T = any>(url: string, params?: any): Promise<T> {
    const fullUrl = `${this.basePath}/${url}`;
    const token = Cookie.get('token');

    try {
      let response;
      if (params) {
        // 如果 DELETE 請求需要攜帶參數
        response = await this.apiRequest.myDeleteMany(fullUrl, token as string, params);
      } else {
        response = await this.apiRequest.myDelete(fullUrl, token as string);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || '發生錯誤！');
    }
  }

  // IMAGE 方法 (處理文件上傳)
  async image<T = any>(data: FormData): Promise<T> {
    const fullUrl = `${this.basePath}image`; // 確保路徑正確
    const token = Cookie.get('token');
  
    if (!token) {
      throw new Error('Token is missing. Please log in again.');
    }
  
    try {
      const response = await this.apiRequest.postUploadImage(fullUrl, token, data);
      return response.data;
    } catch (error: any) {
      console.error('Upload failed:', error.message);
      throw new Error(error.message || '發生錯誤！');
    }
  }
  
}

export default PsiRequest;
