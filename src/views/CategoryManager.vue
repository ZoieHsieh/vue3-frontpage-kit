<template>
  <!-- Toast 提示框 -->
  <div v-if="showToast" :class="['toast', toastType]">
    {{ toastMessage }}
  </div>
  <div class="tree-table">
    <h2>產品類別設定</h2>

    <!-- Dropdown Container -->
    <div class="dropdown-container">
      <!-- Dropdown Label -->
      <div @click="toggleDropdown" class="dropdown-label">
        請選擇產品類別
        <span class="dropdown-arrow" :class="{ open: dropdownOpen }">▼</span>
      </div>

      <!-- Dropdown Menu -->
      <div class="dropdown-menu" v-show="dropdownOpen">
        <div v-for="item in depthOneOptions" :key="item.value" class="dropdown-item">
          <input
            type="checkbox"
            :id="'category-' + item.value"
            :value="item.value"
            v-model="selectedCategories"
          />
          <label :for="'category-' + item.value">
            <img :src="item.image.url" alt="icon" class="item-icon" />
            {{ item.name }}
          </label>
        </div>
      </div>
    </div>

    <!-- 確認按鈕 -->
    <div class="confirm-btn-container">
      <button @click="submitCategories" class="submit-btn">確認</button>
    </div>

    <!-- 已選擇項目 -->
    <div class="selected-items-container">
      <h3>已選擇項目：</h3>
      <div class="selected-items">
        <div class="selected-item" v-for="(item, index) in selectedItems" :key="item.value">
          <img :src="item.image.url" alt="icon" class="selected-item-icon" />
          <span>{{ item.name }}</span>
          <div class="item-controls">
            <button @click="moveItem(index, -1)" :disabled="index === 0" class="control-btn">
              左移
            </button>
            <button
              @click="moveItem(index, 1)"
              :disabled="index === selectedItems.length - 1"
              class="control-btn"
            >
              右移
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { fetchPsiData } from '../api/axios/psiApi'
import { getComponentById, addComponent, updateComponent } from '../api/axios/componentApi'
import { useRoute, useRouter } from 'vue-router'

// 狀態變量
const loading = ref(true)
const dropdownOpen = ref(false) // 控制下拉選單展開/收合
const depthOneOptions = ref<{ name: string; value: number; image: any }[]>([])
const selectedCategories = ref<number[]>([]) // 存放已選擇的 category ID
const categorySequence = ref<{ id: number; sequence: number }[]>([]) // 存放帶有排序的資料
const router = useRouter()
// Toast 狀態
const toastMessage = ref('')
const toastType = ref('') // 'success' or 'error'
const showToast = ref(false)

const route = useRoute()
const mode = route.query.mode
const componentId = route.query.componentId

// 加載 API 資料並過濾 depth: 1
const loadData = async () => {
  try {
    const response = await fetchPsiData('product-category/list', {
      perPage: 100,
      currentPage: 1
    })
    if (response?.dataList) {
      depthOneOptions.value = response.dataList.map((node) => ({
        name: node.name,
        value: node.id,
        image: node.image
      }))
    }
  } catch (error) {
    showToastMessage('加載資料失敗', 'error')
  } finally {
    loading.value = false
  }
}

// 編輯模式下獲取單筆資料
const fetchComponentData = async () => {
  if (mode === 'edit' && componentId) {
    try {
      const response = await getComponentById(Number(componentId))
      if (response?.productCategories) {
        categorySequence.value = response.productCategories.map((item) => ({
          id: item.id, // 編輯模式已有項目需要包含 id
          productCategoryId: item.productCategoryId,
          sequence: item.sequence
        }))
        selectedCategories.value = categorySequence.value.map((item) => item.productCategoryId)
      }
      // showToastMessage('數據加載成功！', 'success')
    } catch (error) {
      console.error('獲取單筆資料失敗:', error.message)
      // showToastMessage('獲取單筆資料失敗', 'error')
    }
  }
}

// 排序好的已選擇項目
const selectedItems = computed(() => {
  return categorySequence.value
    .map((category) =>
      depthOneOptions.value.find((item) => item.value === category.productCategoryId)
    )
    .filter(Boolean) // 過濾掉未找到的項目
})

// 排序功能
const moveItem = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= categorySequence.value.length) return

  const items = [...categorySequence.value]
  const [movedItem] = items.splice(index, 1)
  items.splice(newIndex, 0, movedItem)

  // 重新調整 sequence
  categorySequence.value = items.map((item, i) => ({ ...item, sequence: i + 1 }))
}

// 提交資料
const submitCategories = async () => {
  const payload = {
    name: mode === 'edit' ? 'Updated Component' : 'New Component',
    productCategories: categorySequence.value.map((item) => ({
      ...(item.id ? { id: item.id } : {}), // 只有已存在的項目包含 id
      productCategoryId: item.productCategoryId,
      sequence: item.sequence
    }))
  }

  console.log('提交的 Payload:', payload)

  try {
    if (mode === 'edit') {
      // 編輯模式 - 使用 updateComponent
      await updateComponent(componentId, payload)
      showToastMessage('更新成功！', 'success')
      setTimeout(() => {
        router.push({ name: 'kitHome' })
      }, 3000)
    } else {
      // 新增模式 - 使用 addComponent
      await addComponent(payload)
      showToastMessage('提交成功！', 'success')
      setTimeout(() => {
        router.push({ name: 'kitHome' })
      }, 3000)
    }
  } catch (error) {
    console.error(mode === 'edit' ? '更新失敗:' : '新增失敗:', error.message)
    showToastMessage('提交失敗，請重試。', 'error')
  }
}
// Toast 提示函數
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 切換下拉選單
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

onMounted(async () => {
  await loadData()

  // 如果有 mode 和 componentId，則進行編輯模式初始化
  if (mode === 'edit' && componentId) {
    await fetchComponentData()
  }
})
import { watch } from 'vue'

watch(selectedCategories, (newCategories) => {
  // 添加新勾選的項目
  newCategories.forEach((categoryId) => {
    if (!categorySequence.value.some((item) => item.productCategoryId === categoryId)) {
      categorySequence.value.push({
        productCategoryId: categoryId,
        sequence: categorySequence.value.length + 1 // 新項目順序為最後一位
      })
    }
  })

  // 移除取消勾選的項目
  categorySequence.value = categorySequence.value.filter((item) =>
    newCategories.includes(item.productCategoryId)
  )

  // 重新更新順序
  categorySequence.value = categorySequence.value.map((item, index) => ({
    ...item,
    sequence: index + 1
  }))
})
</script>

<style scoped>
.control-btn {
  padding: 5px 10px;
  background-color: #007acc;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.control-btn:hover {
  background-color: #005f99;
}

.control-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.tree-table {
  font-family: Arial, sans-serif;
  margin: 20px auto;
  max-width: 600px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.dropdown-container {
  margin-bottom: 20px;
}

.dropdown-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
}

.dropdown-label:hover {
  background-color: #f7f7f7;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: relative; /* 相對定位，佔位空間 */
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 5px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f8ff;
}

.dropdown-item input {
  margin-right: 10px;
}

.item-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.confirm-btn-container {
  text-align: center;
  margin-bottom: 20px;
}

.submit-btn {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}

.selected-items-container {
  text-align: center;
}

.selected-items {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.selected-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 上下排列並自動分佈 */
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 100px;
  height: 180px; /* 設定固定高度 */
  position: relative;
}

.selected-item-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}
.item-controls {
  display: flex;
  justify-content: center; /* 水平置中 */
  gap: 10px; /* 按鈕間距 */
  margin-top: auto; /* 將按鈕固定在底部 */
}
.item-controls button {
  margin-top: 5px;
  cursor: pointer;
}
/* Toast 容器 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 100px;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation:
    slideIn 0.5s ease,
    fadeOut 0.5s ease 2.5s forwards;
}

/* 成功樣式 */
.toast.success {
  background-color: #2ecc71; /* 綠色 */
}

/* 錯誤樣式 */
.toast.error {
  background-color: #f44336; /* 紅色 */
}

/* Toast 動畫 */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>
