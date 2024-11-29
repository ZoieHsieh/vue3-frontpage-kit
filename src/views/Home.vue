<template>
  <div class="home-page">
    <h2>Home Page</h2>
    <button @click="openDialog" class="add-component-btn">新增元件</button>
    
    <!-- Dialog -->
    <div v-if="isDialogVisible" class="dialog-overlay">
      <div class="dialog">
        <h3>選擇元件類型</h3>
        <ul class="component-list">
          <li @click="selectComponent('carousel')">輪播元件</li>
          <li @click="selectComponent('category')">分類按鈕</li>
          <li @click="selectComponent('product')">分類商品</li>
          <li @click="selectComponent('hot')">熱銷商品</li>
        </ul>
        <button @click="closeDialog" class="close-dialog-btn">取消</button>
      </div>
    </div>

    <!-- Dynamic Component Rendering -->
    <div v-if="selectedComponent">
      <component :is="selectedComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CarouselManager from '../components/components/CarouselManager.vue'; // 輪播元件，其他元件可按需引入
import { useRouter } from 'vue-router'; // 引入 Vue Router

const router = useRouter(); // 初始化 router
const isDialogVisible = ref(false); // 控制 Dialog 顯示
const selectedComponent = ref<string | null>(null); // 已選擇的元件類型

const openDialog = () => {
  isDialogVisible.value = true;
};

const closeDialog = () => {
  isDialogVisible.value = false;
};

const selectComponent = (type: string) => {
  if (type === 'carousel') {
    router.push({ name: 'Carousel' }); // 跳轉到 Carousel 頁面
  } else if (type === 'category') {
    router.push({ path: '/category' }); // 可根據需要配置其他路由
  }
  else if (type === 'product') {
    router.push({ path: '/productgroup' }); // 可根據需要配置其他路由
  }
  isDialogVisible.value = false; // 關閉 Dialog
};
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 16px;
}

.add-component-btn {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #00d4ff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #000;
}

.add-component-btn:hover {
  background-color: #00a3cc;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.dialog h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.component-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.component-list li {
  padding: 10px;
  background-color: #f4f4f4;
  margin: 8px 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

.component-list li:hover {
  background-color: #ddd;
}

.close-dialog-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-dialog-btn:hover {
  background-color: #ff0000;
}
</style>
