import service from './axios-instance';

// 獲取子模組數據
export const getComponentsList = async (page = 0, limit = 10, companyId = 1) => {
  return await service.get('component', {
    params: { page, limit, companyId },
  });
};

// 新增組件
export const addComponent = async (data: any) => {
  return await service.post('component', data);
};

// 刪除組件
export const deleteComponent = async (componentId: number) => {
  return await service.delete(`component/${componentId}`);
};

// 更改排序
export const reorderComponents = async (data: { id: number; sortOrder: number }[]) => {
  return await service.patch('/component/action/reorder', data);
};
