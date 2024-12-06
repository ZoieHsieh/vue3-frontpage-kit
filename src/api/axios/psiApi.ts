import service from '../axios/axios-instance'
import Cookies from 'js-cookie'

// API 錯誤處理統一封裝
const handleApiError = (error: any) => {
  console.error('API Error:', error)
  throw new Error(error?.response?.data?.message || 'API 請求失敗')
}

// Psi API 封裝類
class PsiApi {
  basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  // 獲取 token 的方法
  private getToken() {
    return Cookies.get('token')
  }

  // 添加 token 到 headers
  private addAuthHeaders(headers: any = {}) {
    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  /**
   * GET 請求
   */
  async get<T = any>(url: string, params?: any): Promise<T> {
    try {
      const queryString = params
        ? new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))
          ).toString()
        : ''
      const fullUrl = queryString
        ? `${this.basePath}/${url}?${queryString}`
        : `${this.basePath}/${url}`

      const response = await service.get(fullUrl, {
        headers: this.addAuthHeaders()
      })
      return response as T
    } catch (error) {
      handleApiError(error)
    }
  }

  /**
   * POST 請求
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response = await service.post(`${this.basePath}/${url}`, data, {
        headers: this.addAuthHeaders()
      })
      return response as T
    } catch (error) {
      handleApiError(error)
    }
  }

  /**
   * PUT 請求
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response = await service.put(`${this.basePath}/${url}`, data, {
        headers: this.addAuthHeaders()
      })
      return response as T
    } catch (error) {
      handleApiError(error)
    }
  }

  /**
   * PATCH 請求
   */
  async patch<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response = await service.patch(`${this.basePath}/${url}`, data, {
        headers: this.addAuthHeaders()
      })
      return response as T
    } catch (error) {
      handleApiError(error)
    }
  }

  /**
   * DELETE 請求
   */
  async delete<T = any>(url: string, params?: any): Promise<T> {
    try {
      const queryString = params
        ? new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))
          ).toString()
        : ''
      const fullUrl = queryString
        ? `${this.basePath}/${url}?${queryString}`
        : `${this.basePath}/${url}`

      const response = await service.delete(fullUrl, {
        headers: this.addAuthHeaders()
      })
      return response as T
    } catch (error) {
      handleApiError(error)
    }
  }
}

// Psi API 實例
const psiApi = new PsiApi(
  import.meta.env.VITE_PSI_API_BASE_URL || 'https://test-speedoo.shopinn.tw/api'
)

// 具體 API 方法

/**
 * 上傳圖片
 * @param file 圖片文件
 * @returns 返回圖片 URL
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await psiApi.post('image', formData)
    return response?.data?.url || '' // 返回圖片的 URL
  } catch (error) {
    handleApiError(error)
  }
}

/**
 * 獲取商品列表
 * @returns 商品列表數據
 */
export const fetchProductList = async () => {
  try {
    const response = await psiApi.get('product/list', {
      perPage: 10,
      currentPage: 1,
      orderBy: 'ID_DESC'
    })
    return response?.data || []
  } catch (error) {
    handleApiError(error)
  }
}
