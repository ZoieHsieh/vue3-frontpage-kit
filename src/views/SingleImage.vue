<template>
  <div class="single-image-manager">
    <h3>圖片上傳元件</h3>
    <div class="image-upload-container">
      <label class="image-placeholder">
        <span v-if="!image.url" class="icon-placeholder">+</span>
        <img v-if="image.url" :src="image.url" alt="uploaded image" />
        <input type="file" @change="handleFileChange" class="file-input" />
      </label>
      <button v-if="image.url" @click="deleteImage" class="delete-btn">X</button>
    </div>
    <input
      v-if="image.url"
      type="text"
      v-model="image.link"
      class="url-input"
      placeholder="輸入導航網址..."
    />

    <!-- Toast 提示框 -->
    <div v-if="showToast" :class="['toast', toastType]">{{ toastMessage }}</div>
  </div>
  <div style="justify-content: center; display: flex">
    <button @click="submitImage" class="submit-btn">提交圖片設定</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '../api/axios/psiApi'
import { addComponent } from '../api/axios/componentApi'

// 單一圖片狀態
const image = ref<{ url: string; link: string; id: number | null }>({ url: '', link: '', id: null })

// Toast 狀態
const toastMessage = ref('')
const toastType = ref('') // 'success' or 'error'
const showToast = ref(false)

// 顯示 Toast 方法
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 處理檔案上傳
const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await uploadImage(formData)
    const { id, url } = response
    image.value.url = url
    image.value.id = id
    showToastMessage('圖片上傳成功！', 'success')
  } catch (error) {
    console.error('Failed to upload image:', error.message)
    showToastMessage('圖片上傳失敗！', 'error')
  }
}

// 刪除圖片
const deleteImage = () => {
  image.value = { url: '', link: '', id: null }
}

// 提交圖片設定
const submitImage = async () => {
  const payload = {
    name: 'Single Image Example',
    type: 'SINGLE_IMAGE',
    companyId: 1,
    urls: [
      {
        imageUrl: image.value.url,
        navUrl: image.value.link
      }
    ],
    sortType: '',
    products: []
  }

  try {
    await addComponent(payload)
    showToastMessage('提交成功！', 'success')
  } catch (error) {
    console.error('提交失敗:', error.message)
    showToastMessage('提交失敗，請重試！', 'error')
  }
}
</script>

<style scoped>
.single-image-manager {
  max-width: 500px;
  margin: 0 auto;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
}

.image-upload-container {
  position: relative;
  display: inline-block;
}

.image-placeholder {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #007acc;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.image-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.file-input {
  display: none;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background-color: #ff4d4d;
  border: none;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.url-input {
  margin-top: 10px;
  padding: 6px 8px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.submit-btn {
  margin-top: 16px;
  padding: 10px 20px;
  background: #59b971;
  color: white;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #4a9e5d;
}

/* Toast 樣式 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation:
    slideIn 0.5s ease,
    fadeOut 0.5s ease 2.5s forwards;
}
.toast.success {
  background-color: #4caf50;
}
.toast.error {
  background-color: #f44336;
}
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
