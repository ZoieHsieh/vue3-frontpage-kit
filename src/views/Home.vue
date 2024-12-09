<template>
  <div class="home-page">
    <!-- <h2>Home Page</h2> -->
    <div style="justify-content: end; display: flex">
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
        <div class="item-header">
          <h3 class="component-title">{{ component.name }}</h3>
          <div class="button-group">
            <button @click="moveUp(index)" :disabled="index === 0" class="arrow-btn">&uarr;</button>
            <button
              @click="moveDown(index)"
              :disabled="index === components.length - 1"
              class="arrow-btn"
            >
              &darr;
            </button>
            <button @click="editComponent(component)" class="edit-btn">編輯</button>
            <button @click="deleteComponent(component.id)" class="delete-btn">刪除</button>
          </div>
        </div>
        <div class="component-content">
          <div v-if="component.urls && component.urls.length" class="image-carousel">
            <div v-for="url in component.urls" :key="url.id" class="carousel-item">
              <img :src="url.imageUrl" :alt="url.navUrl" class="carousel-image" />
              <p class="image-nav-url">{{ url.navUrl }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 引入 Vue Router
import { getComponentsList } from '../api/axios/componentApi' // 引入 API 方法

const router = useRouter() // 初始化 router
const isDialogVisible = ref(false) // 控制 Dialog 顯示
const selectedComponent = ref<string | null>(null) // 已選擇的元件類型
const components = ref<any[]>([]) // 保存從 API 獲取的組件列表

const fetchComponents = async () => {
  try {
    const response = await getComponentsList(0, 10, 1)

    components.value = response.list // 假設 response 中包含 list

    console.log(response) // 打印返回數據
  } catch (error) {
    console.error('Error fetching components:', error)
  }
}

fetchComponents()

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
.components-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
.close-dialog-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.component-list li {
  padding: 10px;
  background-color: #f4f4f4;
  margin: 8px 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

.close-dialog-btn:hover {
  background-color: #ff0000;
}

.component-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: box-shadow 0.3s;
}

.component-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.component-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn,
.delete-btn,
.arrow-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #007bff;
  color: #fff;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #ff4d4d;
  color: #fff;
}

.delete-btn:hover {
  background-color: #cc0000;
}

.arrow-btn {
  background-color: #ffc107;
  color: #fff;
  font-size: 18px;
}

.arrow-btn:disabled {
  background-color: #ddd;
  color: #aaa;
  cursor: not-allowed;
}

.component-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.carousel-item {
  background-color: #f9f9f9;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.carousel-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.image-nav-url {
  font-size: 14px;
  color: #555;
  word-break: break-word;
}
.component-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
