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
    <button @click="submitImage" class="submit-btn">
      {{ mode === 'edit' ? '更新圖片設定' : '提交圖片設定' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { uploadImage } from '../api/axios/psiApi'
import { addComponent, getComponentById, updateComponent } from '../api/axios/componentApi'
import { useRoute, useRouter } from 'vue-router'
import Cookie from 'js-cookie'
// 單一圖片狀態
const image = ref<{ url: string; link: string; id: number | null }>({ url: '', link: '', id: null })
const route = useRoute()
const router = useRouter()
const mode = route.query.mode
const componentId = route.query.componentId
const companyId = Cookie.get('companyId')
// Toast 狀態
const toastMessage = ref('')
const toastType = ref('') // 'success' or 'error'
const showToast = ref(false)

//驗證欄位是否填寫
const validateImage = (): boolean => {
  if (!image.value.url) {
    showToastMessage('請上傳圖片！', 'error')
    return false
  }
  if (!image.value.link) {
    showToastMessage('請輸入導航網址！', 'error')
    return false
  }
  return true
}

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
    const { url } = response // 僅提取圖片 URL
    image.value.url = url // 更新圖片 URL
    showToastMessage('圖片上傳成功！', 'success')
  } catch (error) {
    console.error('圖片上傳失敗:', error.message)
    showToastMessage('圖片上傳失敗！', 'error')
  }
}

// 刪除圖片
const deleteImage = () => {
  image.value = { url: '', link: '', id: null }
}

// 提交圖片設定
const submitImage = async () => {
  // 驗證資料是否完整
  if (!validateImage()) {
    return;
  }

  const payload = {
    name: '', // 新增時的名稱
    type: 'SINGLE_IMAGE', // 固定類型
    companyId: Number(companyId), // 公司 ID，可根據需求動態設定
    urls: [
      {
        imageUrl: image.value.url,
        navUrl: image.value.link
      }
    ],
    sortType: '', // 排序類型，根據需要填充
    products: [] // 預設為空
  };

  try {
    if (mode === 'edit') {
      // 編輯模式
      await updateComponent(componentId, {
        urls: [
          {
            sequence: 0,
            imageUrl: image.value.url,
            navUrl: image.value.link,
            ...(image.value.id ? { id: image.value.id } : {})
          }
        ]
      });
      showToastMessage('更新成功！', 'success');
      setTimeout(() => {
        router.push({ name: 'kitHome' });
      }, 3000);
    } else {
      // 新增模式
      await addComponent(payload);
      showToastMessage('提交成功！', 'success');
      setTimeout(() => {
        router.push({ name: 'kitHome' });
      }, 3000);
    }
  } catch (error) {
    console.error(mode === 'edit' ? '更新失敗:' : '新增失敗:', error.message);
    showToastMessage(mode === 'edit' ? '更新失敗，請重試！' : '提交失敗，請重試！', 'error');
  }
};

const fetchComponentData = async () => {
  if (mode === 'edit' && componentId) {
    try {
      const response = await getComponentById(Number(componentId))
      const { urls } = response

      if (urls && urls.length > 0) {
        const [firstUrl] = urls
        image.value = {
          url: firstUrl.imageUrl,
          link: firstUrl.navUrl,
          id: firstUrl.id
        }
      }
      // showToastMessage('數據加載成功！', 'success')
    } catch (error) {
      console.error('獲取數據失敗:', error.message)
      // showToastMessage('獲取數據失敗！', 'error')
    }
  }
}

onMounted(() => {
  if (mode && componentId) {
    fetchComponentData()
  }
})
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
