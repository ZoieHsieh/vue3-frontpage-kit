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
    <button @click="openProductSelection" class="gap-3" v-if="groupMethod === 'manual'">選擇商品</button>
    
    <!-- Product Selection Dialog -->
    <div v-if="isProductDialogVisible" class="dialog-overlay">
      <div class="dialog">
        <h3>選擇商品</h3>
        <div class="product-list">
          <div v-for="product in products" :key="product.id" class="product-item">
            <img :src="product.imageUrl" alt="product.name" class="product-image" />
            <div class="product-info">
              <p>{{ product.name }}</p>
              <p>{{ product.code }}</p>
            </div>
            <input type="checkbox" v-model="selectedProducts" :value="product" class="custom-checkbox" />
          </div>
        </div>
        <button @click="saveProductSelection" class="save-selection-btn gap-3">完成</button>
        <button @click="closeProductDialog" class="close-dialog-btn gap-3">取消</button>
      </div>
    </div>
    <h4 style="margin-top: 10px;">已選擇的商品</h4>
    <!-- Display Selected Products -->
    <div v-if="selectedProducts.length" class="selected-products" style="margin-top: 10px;">

      <div v-for="product in selectedProducts" :key="product.id" class="selected-product-item">
        <img :src="product.imageUrl" alt="product.name" class="product-image" />
        <div class="product-info">
          <p>{{ product.name }}</p>
          <p>{{ product.code }}</p>
        </div>
        <button @click="removeProduct(product)" class="remove-product-btn">刪除</button>
      </div>
    </div>

    <button @click="addProductGroup" class="add-group-btn">新增</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const groupName = ref('');
const groupMethod = ref('auto');
const isProductDialogVisible = ref(false);
const selectedProducts = ref<Array<{ id: number; name: string; code: string; imageUrl: string }>>([]);

const products = ref([
  { id: 1, name: '超好用皮膚管理精華', code: '0000000000', imageUrl: 'https://media.istockphoto.com/id/931643150/zh/%E5%90%91%E9%87%8F/%E5%9C%96%E7%89%87%E5%9C%96%E7%A4%BA.jpg?s=612x612&w=0&k=20&c=Ignl_tCWjLNX6Bi5BP0DgrII61CHqFIHl25iXfTl5nw=' },
  { id: 2, name: '潮潮潮文創擴音器', code: '0000000001', imageUrl: 'https://media.istockphoto.com/id/931643150/zh/%E5%90%91%E9%87%8F/%E5%9C%96%E7%89%87%E5%9C%96%E7%A4%BA.jpg?s=612x612&w=0&k=20&c=Ignl_tCWjLNX6Bi5BP0DgrII61CHqFIHl25iXfTl5nw=' },
  { id: 3, name: '艾草必備枕芯', code: '0000000002', imageUrl: 'https://media.istockphoto.com/id/931643150/zh/%E5%90%91%E9%87%8F/%E5%9C%96%E7%89%87%E5%9C%96%E7%A4%BA.jpg?s=612x612&w=0&k=20&c=Ignl_tCWjLNX6Bi5BP0DgrII61CHqFIHl25iXfTl5nw=' },
  { id: 4, name: 'Healthy元氣黑茶包', code: '0000000003', imageUrl: 'https://media.istockphoto.com/id/931643150/zh/%E5%90%91%E9%87%8F/%E5%9C%96%E7%89%87%E5%9C%96%E7%A4%BA.jpg?s=612x612&w=0&k=20&c=Ignl_tCWjLNX6Bi5BP0DgrII61CHqFIHl25iXfTl5nw=' },
  { id: 5, name: '超好用皮膚管理霜', code: '0000000004', imageUrl: 'https://media.istockphoto.com/id/931643150/zh/%E5%90%91%E9%87%8F/%E5%9C%96%E7%89%87%E5%9C%96%E7%A4%BA.jpg?s=612x612&w=0&k=20&c=Ignl_tCWjLNX6Bi5BP0DgrII61CHqFIHl25iXfTl5nw=' }
]);

const openProductSelection = () => {
  isProductDialogVisible.value = true;
};

const closeProductDialog = () => {
  isProductDialogVisible.value = false;
};

const saveProductSelection = () => {
  isProductDialogVisible.value = false;
};

const removeProduct = (product: { id: number }) => {
  selectedProducts.value = selectedProducts.value.filter((p) => p.id !== product.id);
};

const addProductGroup = () => {
  console.log('Group Name:', groupName.value);
  console.log('Group Method:', groupMethod.value);
  console.log('Selected Products:', selectedProducts.value);
};
</script>
<style>
.custom-checkbox {
  width: 20px;
  height: 20px;
  accent-color: #007bff;
  margin-right: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.custom-checkbox:hover {
  transform: scale(1.2);
}

.product-group {
  padding: 20px;
  max-width: 80%;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
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

input[type='text'], select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 16px;
  margin: 8px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
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
  overflow: hidden; /* 移除滾輪 */
}

.dialog {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  gap: 16px;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.selected-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.selected-product-item {
  text-align: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.remove-product-btn {
  margin-left: 16px;
  background-color: #ff4d4d;
}

.remove-product-btn:hover {
  background-color: #ff0000;
}
.gap-3{
margin-right: 5px;}
</style>
