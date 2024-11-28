<template>
    <footer class="footer">
      <p>&copy; 2024 邯武科技HandySoft</p>
    </footer>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Footer',
  });
  </script>
  
  <style scoped>
  .footer {
    width: 100%; /* 確保 Footer 滿版寬 */
    background-color: #333; /* 深色背景 */
    color: white; /* 文字顏色 */
    text-align: center;
    padding: 1rem 0;
    position: fixed; /* 固定在底部 */
    bottom: 0; /* 距底部 0 */
    left: 0;
    margin: 0;
  }
  </style>