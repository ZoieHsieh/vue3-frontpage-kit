<template>
    <div class="component-manager">
      <h2>首頁管理</h2>
      <button @click="openModal" class="add-button">新增元件</button>
      
      <!-- 元件列表 -->
      <div v-for="(item, index) in items" :key="index" class="item">
        <span>{{ index + 1 }} - {{ item.label }}</span>
        <div class="actions">
          <button @click="moveUp(index)" :disabled="index === 0">上移</button>
          <button @click="moveDown(index)" :disabled="index === items.length - 1">下移</button>
          <button @click="removeItem(index)">刪除</button>
        </div>
      </div>
  
      <!-- 新增元件的彈窗 -->
      <Modal v-if="showModal" @close="closeModal">
        <h3>新增元件</h3>
        <select v-model="selectedComponentType">
          <option value="" disabled>選擇元件</option>
          <option value="CarouselManager">輪播元件</option>
          <option value="ButtonManager">分類按鈕元件</option>
        </select>
        <button @click="addComponent" :disabled="!selectedComponentType">新增</button>
      </Modal>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Modal from './Modal.vue';
  
  export default defineComponent({
    name: 'ComponentManager',
    components: { Modal },
    setup() {
      const items = ref([]);
      const showModal = ref(false);
      const selectedComponentType = ref('');
  
      const openModal = () => {
        selectedComponentType.value = '';
        showModal.value = true;
      };
  
      const closeModal = () => {
        showModal.value = false;
      };
  
      const addComponent = () => {
        items.value.push({
          label: selectedComponentType.value === 'CarouselManager' ? '輪播元件' : '分類按鈕元件',
          type: selectedComponentType.value,
        });
        closeModal();
      };
  
      const moveUp = (index) => {
        if (index > 0) {
          const item = items.value.splice(index, 1)[0];
          items.value.splice(index - 1, 0, item);
        }
      };
  
      const moveDown = (index) => {
        if (index < items.value.length - 1) {
          const item = items.value.splice(index, 1)[0];
          items.value.splice(index + 1, 0, item);
        }
      };
  
      const removeItem = (index) => {
        items.value.splice(index, 1);
      };
  
      return {
        items,
        showModal,
        selectedComponentType,
        openModal,
        closeModal,
        addComponent,
        moveUp,
        moveDown,
        removeItem,
      };
    },
  });
  </script>
  
  <style scoped>
  .component-manager {
    background: white;
    padding: 20px;
    border-radius: 10px;
  }
  
  .item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .actions button {
    margin-left: 10px;
  }
  </style>
  