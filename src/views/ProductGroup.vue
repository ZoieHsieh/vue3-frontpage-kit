<template>
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
            <input type="checkbox" v-model="selectedProducts" :value="product" class="checkbox" />
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
        <div class="pagination">
          <button
            :disabled="currentPage === 0"
            @click="changePage(currentPage - 1)"
            class="pagination-btn"
          >
            上一頁
          </button>
          <span
            >第 {{ currentPage + 1 }} 頁 / 共 {{ Math.ceil(totalRecords / rowsPerPage) }} 頁</span
          >
          <button
            :disabled="currentPage >= Math.ceil(totalRecords / rowsPerPage) - 1"
            @click="changePage(currentPage + 1)"
            class="pagination-btn"
          >
            下一頁
          </button>
        </div>
        <div class="dialog-actions">
          <button @click="saveProductSelection" class="save-selection-btn">完成</button>
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

    <button @click="addProductGroup" class="add-group-btn">新增</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetchPsiData } from '../api/axios/psiApi'; // 引入 fetchPsiData
import { addComponent } from '../api/axios/componentApi'; // 引入 addComponent API 方法

const groupName = ref('');
const groupMethod = ref('auto');
const isProductDialogVisible = ref(false);
const selectedProducts = ref([]);
const products = ref([]);
const keyword = ref('');
const totalRecords = ref(0);
const currentPage = ref(1);
const rowsPerPage = ref(5); // 每頁顯示5個商品

// 打開商品選擇對話框
const openProductSelection = () => {
  isProductDialogVisible.value = true;
  fetchProductList();
};

// 關閉商品選擇對話框
const closeProductDialog = () => {
  isProductDialogVisible.value = false;
};

// 保存選擇的商品
const saveProductSelection = () => {
  isProductDialogVisible.value = false;
};

// 移除已選擇的商品
const removeProduct = (product) => {
  selectedProducts.value = selectedProducts.value.filter((p) => p.id !== product.id);
};

// 獲取商品列表
const fetchProductList = async () => {
  try {
    const response = await fetchPsiData('product/list', {
      perPage: rowsPerPage.value,
      currentPage: currentPage.value,
      orderBy: 'ID_DESC',
      keyword: keyword.value || '' // 傳遞關鍵字參數
    });

    // 處理圖片 URL 並構造商品數據
    products.value = response.dataList.map((product) => ({
      ...product,
      imageUrl: product.productImageList?.[0]?.image?.url || 'https://via.placeholder.com/100x100'
    }));

    totalRecords.value = response.totalRecords || 0; // 確保總記錄字段存在
  } catch (error) {
    console.error('Failed to fetch product list:', error);
  }
};

// 分頁處理
const changePage = (page) => {
  currentPage.value = page;
  fetchProductList(); // 加載對應頁數的商品
};

// 提交商品群組
const addProductGroup = async () => {
  const payload = {
    name: groupName.value,
    type: "PRODUCT_GROUP",
    companyId: 1,
    urls: [],
    sortType: groupMethod.value === "auto" ? "SYSTEM" : "MANUAL",
    products:
      groupMethod.value === "manual"
        ? selectedProducts.value.map((product) => ({ productId: product.id }))
        : []
  };

  try {
    const response = await addComponent(payload); // 調用API方法
    console.log("新增成功:", response);
    alert("商品群組新增成功！");
  } catch (error) {
    console.error("新增失敗:", error);
    alert("商品群組新增失敗，請稍後再試！");
  }
};
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
</style>
