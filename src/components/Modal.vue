<template>
    <div class="modal-overlay">
      <div class="modal">
        <slot></slot>
        <button @click="$emit('close')" class="close-button">關閉</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Modal',
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
  }
  
  .close-button {
    margin-top: 20px;
  }
  </style>
  