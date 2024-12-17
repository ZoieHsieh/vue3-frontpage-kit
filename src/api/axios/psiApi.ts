import PsiRequest from './psiRequest';
import Cookie from 'js-cookie';
const psiApi = new PsiRequest('');

// 獲取數據
export const fetchPsiData = async (endpoint: string, params?: any) => {
  return await psiApi.get(endpoint, params); // params 自動編碼為查詢參數
};
// 獲取單隻資料
export const fetchSingleData = async (endpoint: string, id: string | number, params?: any) => {
  try {
    // 構建完整的請求 URL
    const fullUrl = `${endpoint}/${id}`;
    
    // 檢查 params 是否有效
    const hasValidParams = params && Object.keys(params).length > 0;
    
    // 如果有有效的 params，則傳遞 params，否則只傳 URL
    const response = hasValidParams
      ? await psiApi.get(fullUrl, { params })
      : await psiApi.get(fullUrl);

    return response; // 返回後端返回的數據
  } catch (error) {
    console.error('Fetch single data failed:', error.message);
    throw error; // 錯誤處理
  }
};


// 上傳圖片
export const uploadImage = async (formData: FormData) => {
  const fullUrl = 'https://test-psi.shopinn.tw/api/image'; // 确保路径正确
  const token = Cookie.get('token'); // 获取 Token

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, 

      },
      body: formData, // 发送 FormData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data; // 返回后端响应
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
};
