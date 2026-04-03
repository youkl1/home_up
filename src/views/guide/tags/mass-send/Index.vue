<template>
  <div class="tags-mass-send">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">标签群发</h1>
      <div class="header-right"></div>
    </div>

    <!-- 选择标签 -->
    <div class="section">
      <h3 class="section-title">选择标签</h3>
      <div class="tags-grid">
        <div
          v-for="tag in allTags"
          :key="tag.id"
          :class="['tag-item', { active: selectedTags.includes(tag.id) }]"
          @click="toggleTag(tag.id)"
        >
          <span class="tag-name">{{ tag.name }}</span>
          <span class="tag-count">({{ tag.customerCount }}人)</span>
        </div>
      </div>
      <div class="selected-info">
        已选择 {{ selectedTags.length }} 个标签，共 {{ totalCustomers }} 位客户
      </div>
    </div>

    <!-- 发送内容 -->
    <div class="section">
      <h3 class="section-title">发送内容</h3>
      <van-tabs v-model="activeTab">
        <van-tab title="短信">
          <van-field
            v-model="smsContent"
            type="textarea"
            :rows="4"
            placeholder="请输入短信内容"
            maxlength="200"
            show-word-limit
          />
        </van-tab>
        <van-tab title="产品">
          <van-field
            v-model="selectedProduct"
            label="选择产品"
            placeholder="请选择要分享的产品"
            is-link
            readonly
            @click="showProductPicker = true"
          />
        </van-tab>
        <van-tab title="案例">
          <van-field
            v-model="selectedCase"
            label="选择案例"
            placeholder="请选择要分享的案例"
            is-link
            readonly
            @click="showCasePicker = true"
          />
        </van-tab>
        <van-tab title="活动">
          <van-field
            v-model="selectedActivity"
            label="选择活动"
            placeholder="请选择要分享的活动"
            is-link
            readonly
            @click="showActivityPicker = true"
          />
        </van-tab>
      </van-tabs>
    </div>

    <!-- 发送设置 -->
    <div class="section">
      <h3 class="section-title">发送设置</h3>
      <van-cell-group>
        <van-cell title="发送间隔" :value="sendInterval + '秒'" is-link @click="showIntervalPicker = true" />
        <van-cell title="定时发送">
          <template #right-icon>
            <van-switch v-model="isScheduled" size="20" />
          </template>
        </van-cell>
        <van-field
          v-if="isScheduled"
          v-model="scheduledTime"
          label="发送时间"
          placeholder="请选择发送时间"
          is-link
          readonly
          @click="showTimePicker = true"
        />
      </van-cell-group>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="primary" class="primary-btn" @click="sendMassMessage">
        发送给 {{ totalCustomers }} 位客户
      </van-button>
    </div>

    <!-- 间隔选择器 -->
    <van-popup v-model:show="showIntervalPicker" position="bottom" round>
      <van-picker
        :columns="intervalOptions"
        @confirm="confirmInterval"
        @cancel="showIntervalPicker = false"
      />
    </van-popup>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showTimePicker" position="bottom" round>
      <van-datetime-picker
        v-model="currentTime"
        type="datetime"
        :min-date="minDate"
        @confirm="confirmTime"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 标签数据
const allTags = ref([
  { id: 1, name: '高意向', customerCount: 15 },
  { id: 2, name: '中意向', customerCount: 23 },
  { id: 3, name: '低意向', customerCount: 8 },
  { id: 4, name: '三居室', customerCount: 12 },
  { id: 5, name: '100-200万', customerCount: 18 },
  { id: 6, name: '现代风格', customerCount: 20 }
])

// 选中的标签
const selectedTags = ref([])

// 当前激活的标签页
const activeTab = ref(0)

// 发送内容
const smsContent = ref('')
const selectedProduct = ref('')
const selectedCase = ref('')
const selectedActivity = ref('')

// 发送设置
const sendInterval = ref(5)
const isScheduled = ref(false)
const scheduledTime = ref('')
const currentTime = ref(new Date())
const minDate = ref(new Date())

// 弹窗显示状态
const showIntervalPicker = ref(false)
const showTimePicker = ref(false)
const showProductPicker = ref(false)
const showCasePicker = ref(false)
const showActivityPicker = ref(false)

// 间隔选项
const intervalOptions = [
  { text: '3秒', value: 3 },
  { text: '5秒', value: 5 },
  { text: '10秒', value: 10 },
  { text: '30秒', value: 30 },
  { text: '60秒', value: 60 }
]

// 计算总客户数
const totalCustomers = computed(() => {
  return selectedTags.value.reduce((total, tagId) => {
    const tag = allTags.value.find(t => t.id === tagId)
    return total + (tag ? tag.customerCount : 0)
  }, 0)
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 切换标签选择
const toggleTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
}

// 确认间隔
const confirmInterval = ({ selectedOptions }) => {
  sendInterval.value = selectedOptions[0].value
  showIntervalPicker.value = false
}

// 确认时间
const confirmTime = (value) => {
  scheduledTime.value = value.toLocaleString()
  showTimePicker.value = false
}

// 发送群发消息
const sendMassMessage = () => {
  if (selectedTags.value.length === 0) {
    alert('请至少选择一个标签')
    return
  }
  // 这里可以实现发送群发消息功能
  console.log('发送群发消息', {
    tags: selectedTags.value,
    content: activeTab.value === 0 ? smsContent.value : selectedProduct.value,
    interval: sendInterval.value,
    isScheduled: isScheduled.value,
    scheduledTime: scheduledTime.value
  })
  router.back()
}
</script>

<style scoped>
.tags-mass-send {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding-bottom: 70px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: white;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #333;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 40px;
}

.section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.tag-count {
  font-size: 12px;
  opacity: 0.8;
}

.selected-info {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  background-color: white;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.primary-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}
</style>
