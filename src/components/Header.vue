<template>
    <header class="header">
      <h1>微服務首頁管理</h1>
    </header>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Header',
  });
  </script>
  
  <style scoped>
  .header {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    text-align: center;
  }
  </style>
  