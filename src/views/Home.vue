<template>
  <!-- Toast 提示框 -->
  <div v-if="showToast" :class="['toast', toastType]">
    {{ toastMessage }}
  </div>
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
          <li @click="selectComponent('product')">商品群組</li>
          <li @click="selectComponent('image')">圖片元件</li>
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
            <button @click="confirmDelete(component.id)" class="delete-btn">刪除</button>
          </div>
        </div>
        <div class="component-content">
          <div class="image-list">
            <div v-for="url in component.urls" :key="url.id" class="image-list-item">
              <img :src="url.imageUrl" alt="圖片" />
              <div class="image-details">
                <p>檔案名稱：{{ url.filename }}</p>
                <p>
                  連結：<a :href="url.navUrl" target="_blank">{{ url.navUrl }}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <!-- 商品群組（PRODUCT_GROUP） -->
          <div v-if="component.type === 'PRODUCT_GROUP'" class="product-group">
            <h4>商品群組</h4>
            <div class="product-list">
              <div
                v-for="product in productDetailsMap[component.id]"
                :key="product.id"
                class="product-card"
              >
                <div class="product-image-container">
                  <img
                    :src="getProductImage(product.productImageList)"
                    alt="商品圖片"
                    class="product-image"
                  />
                </div>
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-code">貨號：{{ product.code }}</p>
                <p class="product-price">價格：{{ product.sellPriceRange || '未設定' }}</p>
              </div>
            </div>
          </div>

          <!-- 產品分類（PRODUCT_CATEGORY） -->
          <div v-if="component.type === 'PRODUCT_CATEGORY'" class="product-category">
            <h4>產品分類</h4>
            <div class="product-list">
              <!-- 主分類 -->
              <div
                v-for="category in productDetailsMap[component.id]"
                :key="category.id"
                class="product-card"
              >
                <div class="product-image-container">
                  <img :src="category.imageUrl" alt="分類圖片" class="product-image" />
                </div>
                <h4 class="product-name">{{ category.name }}</h4>
                <p class="product-code">分類 ID：{{ category.id }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 確認刪除對話框 -->
        <div v-if="isConfirmDialogVisible" class="dialog-overlay">
          <div class="dialog">
            <h3>確認刪除</h3>
            <p>確定要刪除此元件嗎？</p>
            <div class="button-group">
              <button @click="deleteComponentItem" class="confirm-btn">是</button>
              <button @click="isConfirmDialogVisible = false" class="cancel-btn">否</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getComponentsList, deleteComponent, reorderComponents } from '../api/axios/componentApi' //
import { fetchPsiData } from '../api/axios/psiApi'
import Cookie from 'js-cookie'
const isConfirmDialogVisible = ref(false)
const currentComponentId = ref<number | null>(null)
const router = useRouter()
const isDialogVisible = ref(false)
const selectedComponent = ref<string | null>(null)
const components = ref<any[]>([])
// Toast 狀態
const toastMessage = ref('')
const toastType = ref('') // 'success' or 'error'
const showToast = ref(false)
const productDetailsMap = ref<{ [key: number]: any[] }>({})
const companyId = Cookie.get('companyId')
// Toast 提示函數
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 排序元件列表
const sortComponents = () => {
  components.value.sort((a, b) => a.sortOrder - b.sortOrder)
}
// 獲取元件列表
const fetchComponents = async () => {
  try {
    // 假設 companyId 是從外部取得的
    const companyId = Cookie.get('companyId') // 動態獲取公司 ID 的函式

    const response = await getComponentsList(0, 10, companyId)
    components.value = response.list || []
    sortComponents()

    // 處理每個 component 的詳細資料
    for (const component of components.value) {
      try {
        if (component.type === 'PRODUCT_GROUP' && component.products) {
          await fetchProductDetails(component.id, component.products)
        } else if (component.type === 'PRODUCT_CATEGORY' && component.productCategories) {
          await fetchCategoryDetails(component.id, component.productCategories)
        }
      } catch (fetchError) {
        console.error(`Error fetching details for component ID ${component.id}:`, fetchError)
      }
    }

    console.log('Components:', components.value)
  } catch (error) {
    console.error('Error fetching components:', error)
  }
}

const fetchCategoryDetails = async (componentId: number, productCategories: any[]) => {
  try {
    const categoryIdList = productCategories
      .map((category) => `productCategoryIdList=${category.productCategoryId}`)
      .join('&')

    const fullUrl = `product-category/list?perPage=10&currentPage=1&${categoryIdList}`

    const response = await fetchPsiData(fullUrl)

    // 提取每個分類的圖片與基本資訊
    const details = (response.dataList || []).map((category: any) => ({
      id: category.id,
      name: category.name,
      imageUrl: category.image?.url || '', // 提取圖片 URL
      children: category.childrenProductCategoryList || [] // 子分類
    }))

    productDetailsMap.value[componentId] = details
  } catch (error) {
    console.error('Error fetching category details:', error.message)
  }
}

// 更新排序 API 方法
const updateSortOrder = async (changes: { id: number; sortOrder: number }[]) => {
  try {
    const payload = {
      changes: changes.map((change) => ({
        id: change.id,
        sortOrder: change.sortOrder
      }))
    }

    await reorderComponents(payload)
    console.log('Sort order updated successfully:', payload)
  } catch (error) {
    console.error('Error updating sort order:', error)
  }
}

// 上移方法
const moveUp = async (index: number) => {
  if (index > 0) {
    const currentComponent = components.value[index]
    const previousComponent = components.value[index - 1]

    // 交換排序號碼
    ;[currentComponent.sortOrder, previousComponent.sortOrder] = [
      previousComponent.sortOrder,
      currentComponent.sortOrder
    ]

    // 更新排序
    await updateSortOrder([
      { id: currentComponent.id, sortOrder: currentComponent.sortOrder },
      { id: previousComponent.id, sortOrder: previousComponent.sortOrder }
    ])

    // 更新本地數據順序
    sortComponents()
  }
}

// 下移方法
const moveDown = async (index: number) => {
  if (index < components.value.length - 1) {
    const currentComponent = components.value[index]
    const nextComponent = components.value[index + 1]

    // 交換排序號碼
    ;[currentComponent.sortOrder, nextComponent.sortOrder] = [
      nextComponent.sortOrder,
      currentComponent.sortOrder
    ]

    // 更新排序
    await updateSortOrder([
      { id: currentComponent.id, sortOrder: currentComponent.sortOrder },
      { id: nextComponent.id, sortOrder: nextComponent.sortOrder }
    ])

    sortComponents()
  }
}

// 獲取商品詳細資料
const fetchProductDetails = async (componentId: number, products: any[]) => {
  try {
    const productIdList = products.map((product) => `productIdList=${product.productId}`).join('&')
    const baseParams = `currentPage=1&orderBy=ID_DESC`

    const fullUrl = `product/list?${baseParams}${productIdList ? `&${productIdList}` : ''}`

    const response = await fetchPsiData(fullUrl)

    const details = response.dataList || []
    productDetailsMap.value[componentId] = details

    console.log(`Product details for component ${componentId}:`, details)
  } catch (error) {
    console.error('Error fetching product details:', error.message)
  }
}
const defaultImageUrl = '/layout/default.jpg'

// 返回商品圖片或預設圖片
const getProductImage = (productImageList: any[]) => {
  // 如果有圖片，返回第一張圖片的 URL，否則返回預設圖片
  if (productImageList && productImageList.length > 0) {
    return productImageList[0].image.url // 假設每個 image 有 url 屬性
  }
  return defaultImageUrl
}
fetchComponents()

// 當組件加載時調用 API 獲取數據
onMounted(() => {
  fetchComponents()
})

// 上移方法

// 刪除方法
const confirmDelete = (componentId: number) => {
  currentComponentId.value = componentId
  isConfirmDialogVisible.value = true
}

const deleteComponentItem = async () => {
  if (currentComponentId.value !== null) {
    try {
      await deleteComponent(currentComponentId.value)
      components.value = components.value.filter(
        (component) => component.id !== currentComponentId.value
      )
      console.log(`Component with ID ${currentComponentId.value} deleted successfully.`)
      showToastMessage('刪除成功', 'success')
    } catch (error) {
      showToastMessage('刪除失敗', 'error')
      console.error('Error deleting component:', error)
    } finally {
      isConfirmDialogVisible.value = false
      currentComponentId.value = null
    }
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
    router.push({ path: 'category' }) // 可根據需要配置其他路由
  } else if (type === 'product') {
    router.push({ path: '/kit/productgroup' }) // 可根據需要配置其他路由
  } else if (type === 'image') {
    router.push({ path: '/kit/singleimage' })
  }
  isDialogVisible.value = false // 關閉 Dialog
}
const editComponent = (component: any) => {
  const type = component.type

  switch (type) {
    case 'PRODUCT_GROUP':
      router.push({ path: '/kit/productgroup', query: { mode: 'edit', componentId: component.id } })
      break

    case 'IMAGE_CAROUSEL':
      router.push({ name: 'kitCarousel', query: { mode: 'edit', componentId: component.id } })
      break

    case 'PRODUCT_CATEGORY':
      router.push({ path: '/kit/category', query: { mode: 'edit', componentId: component.id } })
      break

    case 'SINGLE_IMAGE':
      router.push({ path: '/kit/singleimage', query: { mode: 'edit', componentId: component.id } })
      break

    default:
      console.error(`Unsupported component type: ${type}`)
  }
}
</script>

<style scoped>
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
  background-color: rgba(0, 0, 0, 0.1); /* 調整透明度，讓背景不全黑 */
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

.image-list {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap: 24px; /* 每個列表項之間的間距 */
}

.image-list-item {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 左右對齊 */
  background: #fff; /* 背景色 */
  border: 1px solid #ddd; /* 邊框 */
  border-radius: 8px; /* 圓角 */
  padding: 16px; /* 內邊距 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 陰影 */
}

.image-list-item img {
  width: 150px; /* 圖片固定寬度 */
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.image-details {
  flex: 1;
  margin-left: 16px;
}

.image-details p {
  margin: 0;
  font-size: 14px;
  color: #555;
}

.image-details a {
  color: #007bff;
  text-decoration: none;
}

.image-details a:hover {
  text-decoration: underline;
}
.image-nav-url {
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-top: 8px;
}

.component-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.confirm-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #ffc107;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e0a800;
}
.product-group {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.product-card {
  padding: 16px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-image-placeholder {
  width: 100%;
  height: 120px;
  background-color: #f4f4f4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.placeholder-icon {
  font-size: 32px;
  color: #ccc;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  margin: 8px 0;
}

.product-code {
  font-size: 14px;
  color: #666;
}

.product-price {
  font-size: 14px;
  color: #007acc;
}
</style>
