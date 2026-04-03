<template>
  <div class="share-component">
    <van-popup v-model:show="show" position="bottom">
      <div class="share-header">
        <h3>分享到</h3>
        <van-icon name="cross" @click="show = false" />
      </div>
      <div class="share-list">
        <div
          v-for="item in shareItems"
          :key="item.id"
          class="share-item"
          @click="onShare(item.id)"
        >
          <div class="share-icon" :class="item.id"></div>
          <div class="share-label">{{ item.name }}</div>
        </div>
      </div>
      <div class="share-cancel">
        <van-button type="default" block @click="show = false">取消</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'share'])

const show = ref(props.show)

// 分享选项
const shareItems = ref([
  { id: 'wechat', name: '微信' },
  { id: 'moments', name: '朋友圈' },
  { id: 'qq', name: 'QQ' },
  { id: 'weibo', name: '微博' }
])

// 监听外部 show 变化
const handleShowChange = (value) => {
  emit('update:show', value)
}

// 分享
const onShare = (platform) => {
  emit('share', platform)
  show.value = false
  emit('update:show', false)
}
</script>

<style scoped>
.share-component {
  /* 组件容器样式 */
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.share-header h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.share-list {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.share-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.share-icon.wechat {
  background-color: #07C160;
}

.share-icon.moments {
  background-color: #07C160;
}

.share-icon.qq {
  background-color: #12B7F5;
}

.share-icon.weibo {
  background-color: #E6162D;
}

.share-label {
  font-size: 12px;
  color: #666;
}

.share-cancel {
  padding: 15px;
}
</style>