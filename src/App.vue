<template>
  <div id="app">
    <TopBar @toggleSidebar="toggleSidebar" />
    <div class="layout">
      <SidebarMenu :open="sidebarOpen" />
      <div class="content-wrapper" :class="{ 'content-sidebar-open': sidebarOpen }">
        <main>
          <router-view />
        </main>
        <Footer />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import TopBar from './components/layout/TopBar.vue';
import SidebarMenu from './components/layout/SidebarMenu.vue';
import Footer from './components/layout/Footer.vue';

// 本地管理側邊欄的開關狀態
const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value; // 切換側邊欄狀態
};
</script>

<style scoped>
#app {
  height: 100vh;
  overflow: hidden; /* 防止頁面本身出現垂直滾動條 */
}

.layout {
  display: flex;
  flex-direction: column; /* 由上到下排列，包含 TopBar、內容部分等 */
  height: 100%;
}

.TopBar {
  position: fixed; /* 固定在頂部 */
  top: 0;
  left: 0;
  right: 0;
  height: 60px; /* 假設 TopBar 的高度 */
  background-color: #fff;
  z-index: 3; /* 層級在最上方 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 增加陰影 */
}

.SidebarMenu {
  position: fixed; /* 側邊欄也固定 */
  top: 60px; /* 緊挨著 TopBar 底部 */
  left: 0;
  height: calc(100vh - 60px); /* 填滿剩下的高度 */
  width: 200px; /* 側邊欄寬度 */
  background-color: #fff;
  z-index: 2; /* 保持較高的層級以避免被主內容遮擋 */
  transition: width 0.3s ease; /* 側邊欄展開和關閉的平滑過渡 */
}

.SidebarMenu[open='false'] {
  width: 0;
  overflow: hidden;
}

.content-wrapper {
  margin-top: 60px; /* 留出 TopBar 的高度 */
  margin-left: 200px; /* 預設側邊欄展開的寬度 */
  height: calc(100vh - 60px); /* 高度為視窗減去 TopBar 的高度 */
  overflow: auto; /* 主內容部分可以滾動，而不是整個頁面 */
  transition: margin-left 0.3s ease;
}

.content-sidebar-open {
  margin-left: 200px; /* 側邊欄展開時，主內容保持右移 */
}

main {
  padding: 2rem;
  background: linear-gradient(135deg, #e8f9ff, #ffffff);
  color: #333;
  font-family: 'Roboto', sans-serif;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

footer {
  width: 100%;
  padding: 1rem;
  background-color: #333;
  color: #fff;
  text-align: center;
  position: fixed; /* 固定在底部 */
  bottom: 0;
  left: 0;
  z-index: 1;
}

</style>
