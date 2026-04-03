<template>
  <div class="nav-bar" :class="{ 'fixed': fixed }">
    <div class="nav-left" @click="onLeftClick">
      <slot name="left">
        <van-icon v-if="showBack" name="arrow-left" />
      </slot>
    </div>
    <div class="nav-center">
      <slot>{{ title }}</slot>
    </div>
    <div class="nav-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  },
  fixed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['leftClick'])

const onLeftClick = () => {
  emit('leftClick')
}
</script>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 15px;
  background-color: #667eea;
  color: white;
  position: relative;
}

.nav-bar.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-left,
.nav-right {
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-center {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>