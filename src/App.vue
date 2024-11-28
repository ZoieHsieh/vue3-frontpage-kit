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
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden; /* 防止頁面垂直滾動 */
}

.SidebarMenu {
  width: 200px;
  transition: width 0.3s ease; /* 側邊欄開關的過渡效果 */
}

.SidebarMenu[open='false'] {
  width: 0;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease; /* 平滑過渡效果 */
}

.content-sidebar-open {
  margin-left: 200px; /* 側邊欄展開時，主內容右移 */
}

main {
  flex: 1;
  padding: 2rem;
  background: linear-gradient(135deg, #e8f9ff, #ffffff);
  color: #333;
  font-family: 'Roboto', sans-serif;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease; /* 平滑調整主內容的寬度 */
}

footer {
  width: 100%;
  padding: 1rem;
  background-color: #333;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
  transition: margin-left 0.3s ease; /* 隨著主內容一起調整 */
}

.content-sidebar-open footer {
  margin-left: 1px; /* 當側邊欄展開時，footer也跟著調整 */
}

</style>


