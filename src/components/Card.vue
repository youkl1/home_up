<template>
  <div class="card" :class="{ 'shadow': shadow }">
    <div v-if="showHeader" class="card-header">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="showFooter" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  shadow: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.card.shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.card-body {
  padding: 15px;
}

.card-footer {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}
</style>