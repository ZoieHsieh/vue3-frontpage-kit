<template>
  <aside :class="{ open: open }" class="sidebar">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/settings">Settings</router-link>
      <router-link to="/about">About</router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps({
  open: Boolean, // 從父組件接收狀態
});
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #ffffff; /* 純白背景 */
  height: 100vh;
  position: fixed;
  left: -200px; /* 初始隱藏 */
  transition: transform 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1); /* 側邊欄陰影 */
}

.sidebar.open {
  transform: translateX(200px); /* 顯示側邊欄時 */
}

.sidebar nav a {
  display: block;
  padding: 1rem;
  color: #333333;
  font-weight: bold;
  border-left: 4px solid transparent; /* 選中效果 */
  transition: all 0.3s ease;
}

.sidebar nav a:hover {
  background: #e6f5f1; /* 綠色 hover 效果 */
  color: #00c389; /* 主色 */
  border-left-color: #00c389;
}
</style>

