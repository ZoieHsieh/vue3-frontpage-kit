<template>
  <!-- Toast 提示框 -->
  <div v-if="showToast" :class="['toast', toastType]">
    {{ toastMessage }}
  </div>
  <div class="product-group">
    <h2>商品群組</h2>
    <div class="form-group">
      <label for="groupName">商品群組名稱</label>
      <input type="text" id="groupName" v-model="groupName" placeholder="此名稱將顯示在前台" />
    </div>
    <div class="form-group">
      <label for="groupMethod">商品群組方式</label>
      <select id="groupMethod" v-model="groupMethod">
        <option value="auto">系統排列實際熱銷商品</option>
        <option value="manual">手動選擇商品</option>
      </select>
    </div>
    <button @click="openProductSelection" v-if="groupMethod === 'manual'" class="add-product-btn">
      選擇商品
    </button>

    <!-- 商品選擇對話框 -->
    <div v-if="isProductDialogVisible" class="dialog-overlay">
      <div class="dialog">
        <h3>選擇商品</h3>
        <div class="search-bar">
          <input
            type="text"
            v-model="keyword"
            @input="fetchProductList"
            class="search-input"
            placeholder="輸入關鍵字篩選"
          />
        </div>
        <div class="product-table">
          <div class="product-header">
            <span>選取</span>
            <span>商品縮圖</span>
            <span>商品名稱</span>
            <span>價格</span>
            <span>貨號</span>
          </div>
          <div v-for="product in products" :key="product.id" class="product-row">
            <input type="checkbox" v-model="product.selected" class="checkbox" />
            <img
              :src="product.imageUrl || 'https://via.placeholder.com/100x100'"
              alt="商品圖片"
              class="product-image"
            />
            <span>{{ product.name }}</span>
            <span>{{ product.sellPriceRange }}</span>
            <span>{{ product.code }}</span>
          </div>
        </div>
        <!-- 分頁按鈕 -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
            上一頁
          </button>
          <span>頁碼 {{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
            下一頁
          </button>
        </div>
        <div class="dialog-actions">
          <button @click="closeProductDialog" class="save-selection-btn">完成</button>
          <button @click="closeProductDialog" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <h4>已選擇的商品</h4>
    <div v-if="selectedProducts.length" class="selected-products">
      <div v-for="product in selectedProducts" :key="product.id" class="selected-product-item">
        <img :src="product.imageUrl" alt="商品圖片" class="product-thumbnail" />
        <p>{{ product.name }}</p>
        <p>{{ product.sellPriceRange }}</p>
        <p>{{ product.code }}</p>
        <button @click="removeProduct(product)" class="cancel-btn">刪除</button>
      </div>
    </div>
    <button @click="addProductGroup" class="add-group-btn">
      {{ mode === 'edit' ? '更新' : '確認送出' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fetchPsiData } from '../api/axios/psiApi'
import { getComponentById, addComponent, updateComponent } from '../api/axios/componentApi'
import { useRoute, useRouter } from 'vue-router'
import Cookie from 'js-cookie'
// Toast 狀態
const toastMessage = ref('')
const toastType = ref('') // 'success' or 'error'
const showToast = ref(false)
const companyId = Cookie.get('companyId')
// 狀態變數
const groupName = ref('')
const groupMethod = ref('auto')
const selectedProducts = ref<any[]>([])
const products = ref<any[]>([])
const currentPage = ref(1) // 當前頁碼
const totalPages = ref(0) // 總頁數
const rowsPerPage = ref(10) // 每頁顯示的記錄數
const totalRecords = ref(0)
const keyword = ref('')
const isProductDialogVisible = ref(false)
const router = useRouter()
const route = useRoute()
const mode = route.query.mode
const componentId = route.query.componentId
const originalData = ref({
  name: '',
  sortType: '',
  products: [] as { productId: number }[]
})
// Toast 提示函數
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
// 打開商品選擇對話框
const openProductSelection = () => {
  isProductDialogVisible.value = true
  fetchProductList()
}

// 關閉商品選擇對話框
const closeProductDialog = () => {
  isProductDialogVisible.value = false
}
//驗證欄位是否填寫
const validateGroup = (): boolean => {
  if (!groupName.value.trim()) {
    showToastMessage('請輸入商品群組名稱！', 'error')
    return false
  }
  if (groupMethod.value === 'manual' && selectedProducts.value.length === 0) {
    showToastMessage('手動模式下，請至少選擇一個商品！', 'error')
    return false
  }
  return true
}
//切換分頁
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    console.log('Go to page:', currentPage.value)
    fetchProductList() // 重新獲取數據
  }
}

const nextPage = () => {
  console.log('Next page button clicked. Current page:', currentPage.value, 'Total pages:', totalPages.value);
  if (totalPages.value === 0) {
    console.log('No pages available. Total records is 0.');
    showToastMessage('沒有更多數據可以顯示。', 'error');
    return;
  }

  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    console.log('Page incremented to:', currentPage.value);
    fetchProductList(); // 重新加載數據
  } else {
    console.log('Already on the last page.');
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// 獲取商品列表
const fetchProductList = async () => {
  try {
    console.log('Fetching products for current page:', currentPage.value);
    const response = await fetchPsiData('product/list', {
      perPage: rowsPerPage.value,
      currentPage: currentPage.value,
      orderBy: 'ID_DESC',
      keyword: keyword.value
    });

    console.log('Full API Response:', response); // 打印完整 API 響應

    // 確保分頁資訊正確提取
    totalRecords.value = response.paging.totalEntries || 0;
    totalPages.value = response.paging.totalPages || 0;

    console.log('Total records:', totalRecords.value, 'Rows per page:', rowsPerPage.value);
    console.log('Calculated total pages:', totalPages.value);

    // 更新商品數據
    products.value = response.dataList.map((product) => ({
      ...product,
      imageUrl: product.productImageList?.[0]?.image?.url || 'https://via.placeholder.com/100x100',
      selected: !!selectedProducts.value.find((p) => p.id === product.id)
    }));

    console.log('Products fetched:', products.value);
  } catch (error) {
    console.error('Error fetching product list:', error.message);
    showToastMessage('無法取得商品列表，請稍後再試！', 'error');
  }
};


// 編輯模式：獲取單筆資料並解析商品
const fetchComponentData = async () => {
  if (mode === 'edit' && componentId) {
    try {
      const response = await getComponentById(Number(componentId))
      groupName.value = response.name
      groupMethod.value = response.sortType === 'MANUAL' ? 'manual' : 'auto'

      const productIds = response.products.map((product: any) => product.productId)
      if (productIds.length > 0) {
        await fetchSelectedProducts(productIds)
      }

      // 初始化已勾選的商品
      selectedProducts.value.forEach((product) => {
        const foundProduct = products.value.find((p) => p.id === product.id)
        if (foundProduct) {
          foundProduct.selected = true // 添加選中狀態
        }
      })
    } catch (error) {
      console.error('獲取單筆數據失敗:', error.message)
    }
  }
}
watch(
  () => products.value.map((product) => product.selected),
  (newSelectedStates) => {
    selectedProducts.value = products.value.filter((product) => product.selected)
  }
)

// 根據 productId 查詢商品詳細資料
const fetchSelectedProducts = async (productIds: number[]) => {
  try {
    // 確保字符串模板中的變數用反引號包裹
    const productIdParams = productIds.map((id) => `productIdList=${id}`).join('&')
    const fullUrl = `product/list?currentPage=1&orderBy=ID_DESC&${productIdParams}`

    const response = await fetchPsiData(fullUrl)

    // 映射數據到 selectedProducts
    selectedProducts.value = response.dataList.map((product: any) => ({
      id: product.id,
      name: product.name,
      code: product.code,
      sellPriceRange: product.sellPriceRange,
      imageUrl: product.productImageList?.[0]?.image?.url || 'https://via.placeholder.com/100x100'
    }))
  } catch (error: any) {
    console.error('獲取商品詳細資料失敗:', error.message)
  }
}

// 移除已選擇的商品
const removeProduct = (product: any) => {
  selectedProducts.value = selectedProducts.value.filter((p) => p.id !== product.id)
  const foundProduct = products.value.find((p) => p.id === product.id)
  if (foundProduct) {
    foundProduct.selected = false // 取消勾選狀態
  }
}

// 提交商品群組
const addProductGroup = async () => {
  // 驗證資料
  if (!validateGroup()) {
    return
  }

  let payload: Record<string, any> = {}

  if (mode === 'edit') {
    // 動態構建 payload
    if (groupName.value !== originalData.value.name) {
      payload.name = groupName.value
    }
    if (
      groupMethod.value === 'manual' &&
      JSON.stringify(selectedProducts.value.map((product) => ({ productId: product.id }))) !==
        JSON.stringify(originalData.value.products)
    ) {
      payload.products = selectedProducts.value.map((product) => ({ productId: product.id }))
    }
    if (groupMethod.value !== originalData.value.sortType) {
      payload.sortType = groupMethod.value === 'auto' ? 'SYSTEM' : 'MANUAL'
    }
  } else {
    // 新增模式 - 全量提交
    payload = {
      name: groupName.value,
      type: 'PRODUCT_GROUP',
      companyId: Number(companyId),
      urls: [],
      sortType: groupMethod.value === 'auto' ? 'SYSTEM' : 'MANUAL',
      products:
        groupMethod.value === 'manual'
          ? selectedProducts.value.map((product) => ({ productId: product.id }))
          : []
    }
  }

  try {
    if (mode === 'edit') {
      // 更新模式
      if (Object.keys(payload).length > 0) {
        await updateComponent(componentId, payload)
        showToastMessage('更新成功！', 'success')
        setTimeout(() => {
          router.push({ name: 'kitHome' })
        }, 3000)
      } else {
        showToastMessage('沒有需要更新的內容', 'success')
      }
    } else {
      // 新增模式
      await addComponent(payload)
      showToastMessage('商品群組新增成功！', 'success')
      setTimeout(() => {
        router.push({ name: 'kitHome' })
      }, 3000)
    }
  } catch (error) {
    console.error('提交失敗:', error.message)
    showToastMessage('提交失敗，請重試。', 'error')
  }
}

onMounted(() => {
  console.log('Mode:', mode, 'ComponentId:', componentId)
  if (mode && componentId) {
    fetchComponentData()
  }
})
</script>

<style scoped>
/* 通用樣式 */
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
  z-index: 1000;
}

.dialog {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 1000px; /* 增大對話框的最大寬度 */
  max-height: 80%; /* 限制高度 */
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
  overflow-y: auto; /* 超出內容時顯示滾動條 */
}

.search-bar input {
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.product-table {
  display: grid;
  gap: 12px;
}

.product-header,
.product-row {
  display: grid;
  grid-template-columns: 60px 120px 1fr 100px 100px; /* 調整列寬比例 */
  align-items: center;
  text-align: left; /* 避免文字居中影響顯示 */
}
.product-header {
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  padding: 10px 0;
}

.product-row {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.product-row span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 過長文字顯示省略號 */
}

.product-name {
  font-size: 14px;
  word-break: break-word; /* 如果文字過長則換行 */
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover; /* 確保圖片比例不變 */
  border-radius: 8px; /* 美化圖片邊角 */
}

.product-info {
  flex-grow: 1; /* 自適應填充剩餘空間 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
}

.product-price,
.product-code {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
}
/* 分頁樣式 */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.pagination-btn {
  padding: 8px 12px;
  margin: 0 4px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.pagination-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* 選擇商品按鈕 */
.dialog-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.save-selection-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
}

.save-selection-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #c82333;
}

/* 已選商品卡片 */
.selected-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 每列最小寬度200px */
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.selected-product-item {
  text-align: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 保持內容和按鈕分開 */
  align-items: center;
  height: 300px; /* 固定高度 */
  width: 200px; /* 固定寬度 */
}

.product-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 8px;
}

.remove-product-btn {
  margin-top: 16px;
  padding: 8px 12px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* 寬度固定 */
  font-size: 14px; /* 調整字體大小 */
}
.remove-product-btn:hover {
  background-color: #cc0000;
}

/* 無商品時的空狀態 */
.no-products {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 20px;
}

/* 頁面整體樣式 */
.product-group {
  padding: 20px;
  max-width: 80%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type='text'],
select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.add-product-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.add-product-btn:hover {
  background-color: #0056b3;
}

.add-group-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.add-group-btn:hover {
  background-color: #218838;
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
