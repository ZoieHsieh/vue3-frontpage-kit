<template>
  <div class="carousel-manager">
    <h3>輪播元件</h3>
    <div class="carousel-images">
      <div v-for="(image, index) in images" :key="index" class="carousel-image">
        <div class="image-container">
          <label class="image-placeholder">
            <span v-if="!image.url" class="icon-placeholder">+</span>
            <img v-if="image.url" :src="image.url" alt="uploaded image" />
            <input type="file" @change="handleFileChange($event, index)" class="file-input" />
          </label>
          <button @click="deleteImage(index)" class="delete-btn">X</button>
        </div>
        <input
          type="text"
          v-model="images[index].link"
          class="url-input"
          placeholder="輸入導航網址..."
        />
        <button @click="moveLeft(index)" :disabled="index === 0" class="control-btn">左移</button>
        <button
          @click="moveRight(index)"
          :disabled="index === images.length - 1"
          class="control-btn"
        >
          右移
        </button>
      </div>
    </div>
    <button @click="addImage" class="add-image-btn">新增圖片</button>
    <button @click="submitCarousel" class="submit-btn">
      {{ mode === 'edit' ? '更新輪播設定' : '提交輪播設定' }}
    </button>
  </div>
  <!-- Toast 提示框 -->
  <div v-if="showToast" :class="['toast', toastType]">{{ toastMessage }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { uploadImage } from '../api/axios/psiApi'
import { addComponent, getComponentById, updateComponent } from '../api/axios/componentApi'
import { useRoute, useRouter } from 'vue-router'
const images = ref([{ url: '', link: '', sequence: 1, id: null }])
const route = useRoute()
const router = useRouter()
const mode = route.query.mode
const componentId = route.query.componentId
// Toast 狀態
const toastMessage = ref('')
const toastType = ref('') // 'success' or 'error'
const showToast = ref(false)

// 顯示 Toast 方法
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  // 3 秒後自動消失
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const addImage = () => {
  images.value.push({ url: '', link: '', sequence: images.value.length + 1, id: null })
}

const deleteImage = (index: number) => {
  images.value.splice(index, 1)
  updateSequence()
}

const moveLeft = (index: number) => {
  if (index > 0) {
    const item = images.value.splice(index, 1)[0]
    images.value.splice(index - 1, 0, item)
    updateSequence()
  }
}

const moveRight = (index: number) => {
  if (index < images.value.length - 1) {
    const item = images.value.splice(index, 1)[0]
    images.value.splice(index + 1, 0, item)
    updateSequence()
  }
}

const updateSequence = () => {
  images.value.forEach((image, index) => {
    image.sequence = index + 1
  })
}

const handleFileChange = async (event: Event, index: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await uploadImage(formData)
    const { url } = response // 獲取圖片 URL
    images.value[index].url = url // 僅更新圖片 URL
    showToastMessage('圖片上傳成功！', 'success')
  } catch (error) {
    console.error('Failed to upload image:', error.message)
    showToastMessage('圖片上傳失敗！', 'error')
  }
}

// 提交輪播設定
const submitCarousel = async () => {
  let payload

  if (mode === 'edit') {
    // 編輯模式 - 傳遞已有項目及其 ID
    payload = {
      urls: images.value.map((image) => ({
        id: image.id || null, // 保留項目 ID（新增項目則為 null）
        imageUrl: image.url, // 圖片的 URL
        navUrl: image.link, // 導航連結
        sequence: image.sequence // 順序
      }))
    }
  } else {
    // 新增模式 - 全量資料
    payload = {
      name: 'Image Carousel Example',
      type: 'IMAGE_CAROUSEL',
      companyId: 1,
      urls: images.value.map((image) => ({
        id: null, // 新增項目無 ID
        imageUrl: image.url,
        navUrl: image.link,
        sequence: image.sequence
      })),
      sortType: '',
      products: []
    }
  }

  try {
    if (mode === 'edit') {
      // 使用 updateComponent API
      await updateComponent(componentId, payload)
      showToastMessage('更新成功！', 'success')
      setTimeout(() => {
        router.push({ name: 'kitHome' })
      }, 3000)
    } else {
      // 使用 addComponent API
      await addComponent(payload)
      showToastMessage('提交成功！', 'success')
      setTimeout(() => {
        router.push({ name: 'kitHome' })
      }, 3000)
    }
  } catch (error) {
    console.error(mode === 'edit' ? '更新組件失敗:' : '新增組件失敗:', error.message)
    showToastMessage(mode === 'edit' ? '更新失敗，請重試！' : '提交失敗，請重試！', 'error')
  }
}

//取得編輯模式的元件資料
const fetchComponentData = async () => {
  try {
    const response = await getComponentById(componentId)
    const { urls } = response
    images.value = urls.map((item) => ({
      id: item.id,
      url: item.imageUrl,
      link: item.navUrl,
      sequence: item.sequence
    }))
    showToastMessage('載入資料成功！', 'success')
  } catch (error) {
    showToastMessage('無法取得元件資料！', 'error')
  }
}

// 初始化，判斷是否為編輯模式
onMounted(() => {
  if (mode && componentId) {
    fetchComponentData()
  }
})
</script>

<style scoped>
.carousel-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 20px;
  color: #333;
  text-align: center;
  margin-bottom: 16px;
}

.carousel-images {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
}

.carousel-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.image-placeholder {
  position: relative;
  width: 120px;
  height: 120px;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #007acc;
  border-radius: 6px;
  transition: background 0.3s ease;
  overflow: visible; /* 防止裁剪 */
}

.image-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-placeholder:hover {
  background-color: #e6f7ff;
}

.file-input {
  display: none;
  overflow: visible; /* 確保按鈕不會被裁掉 */
}

.image-container {
  position: relative;
  overflow: visible; /* 確保按鈕不會被裁掉 */
}

.delete-btn {
  position: absolute;
  top: -2px; /* 向上移動，避免按鈕與圖片重疊 */
  right: -12px; /* 向右移動，避免按鈕與圖片重疊 */
  width: 24px;
  height: 24px;
  background-color: #ff4d4d;
  border: none;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
  z-index: 10; /* 確保按鈕顯示在最上層 */
}
.submit-btn {
  padding: 10px 20px;
  background: #59b971;
  color: white;
  border-radius: 8px;
  font-weight: 700;

  cursor: pointer;
  border: none;
  transition: background 0.3s ease;
  margin: 0 auto;
}
.delete-btn:hover {
  background-color: #ff0000;
}

.carousel-images {
  display: flex;
  gap: 16px;
  overflow-x: auto; /* 僅橫向滾動，其他方向無限制 */
}

.carousel-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  overflow: visible; /* 確保圖片和按鈕都不被裁剪 */
}

.url-input {
  margin-top: 10px;
  margin-bottom: 10px; /* 增加輸入框的上下間距 */
  padding: 6px 8px;
  width: calc(100% - 16px); /* 確保輸入框不緊貼邊緣 */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.add-image-btn {
  display: block;
  padding: 10px 20px;
  background: #007acc;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;
  margin: 0 auto;
}

.add-image-btn:hover {
  background: #005f99;
}

.control-btn {
  padding: 5px 10px;
  background-color: #007acc;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.3s ease;
}

.control-btn:hover {
  background-color: #005f99;
}

.control-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
/* Toast 提示框樣式 */
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
  background-color: #4caf50; /* 綠色 */
}

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
