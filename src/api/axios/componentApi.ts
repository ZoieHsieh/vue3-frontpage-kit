import Request from './axios-instance';

// 初始化 Kit API 請求實例
const componentApi = new Request(import.meta.env.VITE_KIT_API_BASE_URL || 'https://test-psi.shopinn.tw/handy-mainpage-editor');

/**
 * 獲取組件列表
 * @returns 返回組件列表數據
 */
export const getComponentsList = async (): Promise<any> => {
  try {
    const response = await componentApi.get('component', {
      page: 1,
      limit: 10,
      companyId: 1,
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch components list:', error);
    throw new Error('獲取組件列表失敗');
  }
};

/**
 * 新增組件
 * @param payload 組件的數據
 * @returns 新增結果
 */
export const addComponent = async (payload: any): Promise<any> => {
  try {
    const response = await componentApi.post('component', payload);
    return response;
  } catch (error) {
    console.error('Failed to add component:', error);
    throw new Error('新增組件失敗');
  }
};
