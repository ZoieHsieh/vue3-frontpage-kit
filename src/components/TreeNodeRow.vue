<template>
    <tr>
      <td :style="{ paddingLeft: `${level * 20}px` }">
        <!-- 展開/收起按鈕 -->
        <button v-if="node.children.length" @click="toggle" class="expand-btn">
          {{ isExpanded ? '－' : '＋' }}
        </button>
  
        <!-- Checkbox -->
        <input type="checkbox" v-model="node.checked" @change="onCheckChange" />
  
        <!-- 節點名稱 -->
        {{ node.name }}
      </td>
    </tr>
    <!-- 子節點渲染 -->
    <template v-if="isExpanded">
      <TreeNodeRow
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        @check-change="$emit('check-change')"
      />
    </template>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  
  // 接收父層傳入的節點和層級
  const props = defineProps({
    node: Object as any,
    level: Number
  })
  
  // 定義事件
  const emit = defineEmits(['check-change'])
  
  // 控制展開/收起狀態
  const isExpanded = ref(false)
  
  // 切換展開狀態
  const toggle = () => {
    isExpanded.value = !isExpanded.value
  }
  
  // Checkbox 變化時，觸發事件並同步所有子節點的狀態
  const onCheckChange = () => {
    updateChildrenCheckbox(props.node, props.node.checked)
    emit('check-change')
  }
  
  // 遞迴更新所有子節點的 Checkbox 狀態
  const updateChildrenCheckbox = (node: any, isChecked: boolean) => {
    node.children.forEach((child: any) => {
      child.checked = isChecked
      if (child.children.length) {
        updateChildrenCheckbox(child, isChecked)
      }
    })
  }
  </script>
  
  <style scoped>
  button.expand-btn {
    margin-right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button.expand-btn:hover {
    color: #4caf50;
  }
  
  input[type='checkbox'] {
    margin-right: 8px;
  }
  </style>
  