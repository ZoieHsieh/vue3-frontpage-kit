<template>
    <div class="carousel-manager">
      <h3>輪播元件</h3>
      <div class="carousel-images">
        <div v-for="(image, index) in images" :key="index" class="carousel-image">
          <label class="image-placeholder">
            <span v-if="!image.url">1:1</span>
            <img v-if="image.url" :src="image.url" alt="uploaded image" />
            <input type="file" @change="handleFileChange($event, index)" class="file-input" />
          </label>
          <button @click="moveLeft(index)" :disabled="index === 0" class="control-btn">左移</button>
          <button @click="moveRight(index)" :disabled="index === images.length - 1" class="control-btn">右移</button>
        </div>
      </div>
      <button @click="addImage" class="add-image-btn">新增圖片</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'CarouselManager',
    setup() {
      const images = ref([
        { url: '', label: '1:1' },
        { url: '', label: '1:1' },
        { url: '', label: '1:1' },
        { url: '', label: '1:1' },
      ]);
  
      const addImage = () => {
        images.value.push({ url: '', label: '1:1' });
      };
  
      const moveLeft = (index: number) => {
        if (index > 0) {
          const item = images.value.splice(index, 1)[0];
          images.value.splice(index - 1, 0, item);
        }
      };
  
      const moveRight = (index: number) => {
        if (index < images.value.length - 1) {
          const item = images.value.splice(index, 1)[0];
          images.value.splice(index + 1, 0, item);
        }
      };
  
      const handleFileChange = (event: Event, index: number) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            images.value[index].url = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      };
  
      return { images, addImage, moveLeft, moveRight, handleFileChange };
    }
  });
  </script>
  
  <style scoped>
  .carousel-manager {
    padding: 16px;
    background-color: #1f1f1f;
    border-radius: 8px;
    color: #ffffff;
  }
  
  h3 {
    font-size: 18px;
    color: #00d4ff;
    text-align: center;
    margin-bottom: 16px;
  }
  
  .carousel-images {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
  
  .carousel-image {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .image-placeholder {
    width: 60px;
    height: 60px;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px dashed #00d4ff;
    border-radius: 4px;
    position: relative;
    transition: background 0.3s ease;
  }
  
  .image-placeholder:hover {
    background-color: #444;
  }
  
  .image-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .file-input {
    display: none;
  }
  
  .add-image-btn {
    display: block;
    padding: 6px 12px;
    background: #00d4ff;
    color: #000;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 16px;
    border: none;
    transition: background 0.3s ease;
  }
  
  .add-image-btn:hover {
    background: #00a3cc;
  }
  
  .control-btn {
    padding: 4px 8px;
    background-color: #444;
    border: none;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.3s ease;
  }
  
  .control-btn:hover {
    background-color: #555;
  }
  </style>
  