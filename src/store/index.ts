import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    sidebarOpen: true, // 默認側邊欄是打開的
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen; // 切換側邊欄狀態
    },
  },
});
import { LoadingStore } from './loading'
// import { useAuthStore } from './auth'
export { LoadingStore }