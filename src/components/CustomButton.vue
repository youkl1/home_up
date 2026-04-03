<template>
  <van-button
    :type="type"
    :size="size"
    :plain="plain"
    :round="round"
    :disabled="disabled"
    :loading="loading"
    :block="block"
    @click="onClick"
  >
    <slot></slot>
  </van-button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'info', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'large', 'small', 'mini'].includes(value)
  },
  plain: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const onClick = (event) => {
  emit('click', event)
}
</script>

<style scoped>
/* 自定义按钮样式可以在这里添加 */
</style>