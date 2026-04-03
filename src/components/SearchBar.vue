<template>
  <div class="search-bar">
    <van-search
      v-model="searchValue"
      :placeholder="placeholder"
      :show-action="showAction"
      :shape="shape"
      @search="onSearch"
      @cancel="onCancel"
      @focus="onFocus"
      @blur="onBlur"
    >
      <template #left>
        <slot name="left"></slot>
      </template>
      <template #action>
        <slot name="action">
          <span v-if="showAction" @click="onCancel" class="cancel-btn">取消</span>
        </slot>
      </template>
    </van-search>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索'
  },
  showAction: {
    type: Boolean,
    default: true
  },
  shape: {
    type: String,
    default: 'round',
    validator: (value) => ['round', 'square'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'cancel', 'focus', 'blur'])

const searchValue = ref(props.modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

// 监听内部值变化
watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const onSearch = (value) => {
  emit('search', value)
}

const onCancel = () => {
  searchValue.value = ''
  emit('cancel')
  emit('update:modelValue', '')
}

const onFocus = () => {
  emit('focus')
}

const onBlur = () => {
  emit('blur')
}
</script>

<style scoped>
.search-bar {
  padding: 10px 15px;
  background-color: white;
}

.cancel-btn {
  font-size: 14px;
  color: #667eea;
  margin-left: 10px;
  cursor: pointer;
}
</style>