<template>
  <div class="button-manager">
    <h2>分類按鈕元件</h2>
    <button @click="openAddModal" class="add-button">新增按鈕</button>
    
    <!-- 按鈕列表 -->
    <div v-for="(button, index) in buttons" :key="index" class="button-item">
      <div class="button-details">
        <span>{{ index + 1 }}</span>
        <span>{{ button.label }}</span>
        <button @click="moveUp(index)" :disabled="index === 0">上移</button>
        <button @click="moveDown(index)" :disabled="index === buttons.length - 1">下移</button>
      </div>
      <div class="button-actions">
        <button @click="openEditModal(button, index)">編輯</button>
        <button @click="removeButton(index)" class="delete-button">刪除</button>
      </div>
    </div>

    <!-- 新增/編輯按鈕的彈窗 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ isEditing ? '編輯按鈕' : '新增按鈕' }}</h3>
        <label>
          圖片網址：
          <input type="text" v-model="tempButton.url" />
        </label>
        <label>
          連結：
          <input type="text" v-model="tempButton.link" />
        </label>
        <div class="modal-buttons">
          <button @click="saveButton">{{ isEditing ? '更新' : '新增' }}</button>
          <button @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ButtonManager',
  setup() {
    const buttons = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const editIndex = ref(-1);
    const tempButton = ref({ label: '', url: '', link: '' });

    const openAddModal = () => {
      isEditing.value = false;
      tempButton.value = { label: `按鈕${buttons.value.length + 1}`, url: '', link: '' };
      showModal.value = true;
    };

    const openEditModal = (button, index) => {
      isEditing.value = true;
      editIndex.value = index;
      tempButton.value = { ...button };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveButton = () => {
      if (isEditing.value) {
        buttons.value[editIndex.value] = { ...tempButton.value };
      } else {
        buttons.value.push({ ...tempButton.value });
      }
      closeModal();
    };

    const removeButton = (index) => {
      buttons.value.splice(index, 1);
    };

    const moveUp = (index) => {
      if (index > 0) {
        const item = buttons.value.splice(index, 1)[0];
        buttons.value.splice(index - 1, 0, item);
      }
    };

    const moveDown = (index) => {
      if (index < buttons.value.length - 1) {
        const item = buttons.value.splice(index, 1)[0];
        buttons.value.splice(index + 1, 0, item);
      }
    };

    return {
      buttons,
      showModal,
      isEditing,
      tempButton,
      openAddModal,
      openEditModal,
      closeModal,
      saveButton,
      removeButton,
      moveUp,
      moveDown,
    };
  }
});
</script>

<style scoped>
.button-manager {
  padding: 16px;
}

.add-button {
  padding: 8px 16px;
  margin-bottom: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

.button-details, .button-actions {
  display: flex;
  align-items: center;
}

.button-details span {
  margin-right: 8px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal label {
  display: block;
  margin: 10px 0;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.delete-button {
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
}
</style>
