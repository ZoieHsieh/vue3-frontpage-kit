<template>
  <div class="home-page">
    <!-- <h2>Home Page</h2> -->
   <div style="justify-content: end;display: flex;">
    <button @click="openDialog" class="add-component-btn">新增元件</button>
   </div>

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

    <!-- 顯示 API 獲取的列表 -->
    <div class="components-list">
      <div v-for="(component, index) in components" :key="component.id" class="component-item">
        <div class="actions">
          <button @click="moveUp(index)" :disabled="index === 0" class="arrow-btn">&uarr;</button>
          <button
            @click="moveDown(index)"
            :disabled="index === components.length - 1"
            class="arrow-btn"
          >
            &darr;
          </button>
        </div>
        <div class="item-content">
          <h3>{{ component.type }}</h3>
          <p>{{ component.name }}</p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CarouselManager from '../components/components/CarouselManager.vue' // 輪播元件，其他元件可按需引入
import { useRouter } from 'vue-router' // 引入 Vue Router
import { getComponentsList } from '../api/axios/componentApi' // 引入 API 方法

const router = useRouter() // 初始化 router
const isDialogVisible = ref(false) // 控制 Dialog 顯示
const selectedComponent = ref<string | null>(null) // 已選擇的元件類型
const components = ref<any[]>([]) // 保存從 API 獲取的組件列表

// 獲取組件列表
const fetchComponents = async () => {
  try {
    const response = await getComponentsList()
    components.value = response.list // 假設 response 中包含 list
  } catch (error) {
    console.error('Failed to fetch components:', error)
  }
}

// 當組件加載時調用 API 獲取數據
onMounted(() => {
  fetchComponents()
})

// 上移方法
const moveUp = (index: number) => {
  if (index > 0) {
    const temp = components.value[index]
    components.value[index] = components.value[index - 1]
    components.value[index - 1] = temp
  }
}

// 下移方法
const moveDown = (index: number) => {
  if (index < components.value.length - 1) {
    const temp = components.value[index]
    components.value[index] = components.value[index + 1]
    components.value[index + 1] = temp
  }
}

const openDialog = () => {
  isDialogVisible.value = true
}

const closeDialog = () => {
  isDialogVisible.value = false
}

const selectComponent = (type: string) => {
  if (type === 'carousel') {
    router.push({ name: 'kitCarousel' }) // 跳轉到 Carousel 頁面
  } else if (type === 'category') {
    router.push({ path: 'kit/category' }) // 可根據需要配置其他路由
  } else if (type === 'product') {
    router.push({ path: '/kit/productgroup' }) // 可根據需要配置其他路由
  }
  isDialogVisible.value = false // 關閉 Dialog
}
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 16px;
  background-color: white; /* 頁面背景白色 */
  position: relative; /* 讓新增元件按鈕可以定位 */
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

.components-list {
  margin-top: 32px;
}

.component-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.item-content {
  display: flex;
  flex-direction: column;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arrow-btn {
  width: 40px; /* 設定固定寬度 */
  height: 40px; /* 設定固定高度，與寬度相同 */
  padding: 0; /* 移除內邊距，讓文字居中 */
  border: none; /* 移除邊框 */
  background-color: #007bff; /* 按鈕背景顏色 */
  color: #fff; /* 按鈕文字顏色 */
  border-radius: 50%; /* 設為 50%，實現圓形效果 */
  cursor: pointer; /* 滑鼠移上時顯示手形 */
  font-size: 25px; /* 確保箭頭符號顯示清晰 */
  display: flex; /* 使用 flex 居中對齊 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.arrow-btn:disabled {
  background-color: #ccc; /* 禁用狀態的背景顏色 */
  cursor: not-allowed; /* 禁用狀態的滑鼠樣式 */
}
</style>
