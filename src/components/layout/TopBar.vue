<template>
  <header class="top-bar">
    <h1>首頁管理服務</h1>
    <div class="hamburger" @click="$emit('toggleSidebar')">
      <div>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 1rem;
  border-bottom: 1px solid #e6edf3; /* 分隔線效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 淡陰影 */
}

.top-bar h1 {
  font-size: 1.5rem;
  color: #1f2937;
}

.hamburger {
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger div {
  width: 30px;
  height: 2px;
  background: #333333;
  position: relative;
  transition: all 0.3s ease;
}

.hamburger div span {
  display: block;
  width: 100%;
  height: 2px;
  background: #333333;
  position: absolute;
  transition: all 0.3s ease;
}

.hamburger div span:nth-child(1) {
  top: -8px;
}

.hamburger div span:nth-child(2) {
  top: 0;
}

.hamburger div span:nth-child(3) {
  top: 8px;
}
</style>


