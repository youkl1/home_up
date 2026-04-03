<template>
  <div class="ai-suggestions">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">AI话术建议</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 客户选择 -->
    <div class="customer-select">
      <van-field
        v-model="selectedCustomer"
        label="选择客户"
        placeholder="请选择客户"
        is-link
        @click="showCustomerPicker = true"
      />
    </div>
    
    <!-- 话术类型 -->
    <div class="speech-type">
      <van-tabs v-model="activeTab" @change="handleTabChange">
        <van-tab title="跟进话术" />
        <van-tab title="异议处理" />
        <van-tab title="邀约话术" />
      </van-tabs>
    </div>
    
    <!-- 话术列表 -->
    <div class="speech-list">
      <div 
        v-for="(speech, index) in currentSpeeches" 
        :key="index"
        class="speech-item"
      >
        <div class="speech-content">
          <p class="speech-text">{{ speech.content }}</p>
          <div class="speech-meta">
            <span class="speech-score">匹配度: {{ speech.score }}%</span>
            <span class="speech-time">{{ speech.time }}</span>
          </div>
        </div>
        <div class="speech-actions">
          <van-button size="small" @click="copySpeech(speech.content)">复制</van-button>
          <van-button size="small" type="primary" @click="sendSms(speech.content)">发短信</van-button>
          <van-button size="small" @click="saveToLibrary(speech.content)">收藏</van-button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="currentSpeeches.length === 0" class="empty-state">
      <img src="/src/assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无话术建议</p>
      <van-button type="primary" @click="generateSpeeches">生成话术</van-button>
    </div>
    
    <!-- 客户选择器 -->
    <van-popup v-model:show="showCustomerPicker" position="bottom" round>
      <div class="popup-content">
        <h3 class="popup-title">选择客户</h3>
        <van-picker
          v-model="customerIndex"
          :columns="customerOptions"
          @confirm="confirmCustomer"
        />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 客户选择
const selectedCustomer = ref('')
const showCustomerPicker = ref(false)
const customerIndex = ref([0])
const customerOptions = [
  { text: '张三', value: '张三' },
  { text: '李四', value: '李四' },
  { text: '王五', value: '王五' },
  { text: '赵六', value: '赵六' }
]

// 话术类型
const activeTab = ref(0)

// 话术数据
const followSpeeches = ref([
  {
    content: '您好，我是HomeUp的导购顾问，上次和您聊到的现代风格沙发，最近有新的优惠活动，想和您分享一下详情。',
    score: 95,
    time: '刚刚'
  },
  {
    content: '张女士，上次您看中的那套家具，我们现在有周年庆活动，折扣力度很大，您有时间来门店看看吗？',
    score: 92,
    time: '5分钟前'
  }
])

const objectionSpeeches = ref([
  {
    content: '关于价格方面，我们现在有促销活动，这套家具可以享受8折优惠，而且包含免费送货和安装服务。',
    score: 90,
    time: '刚刚'
  },
  {
    content: '您担心的质量问题，我们所有产品都有3年质保，而且提供终身维护服务，您可以完全放心。',
    score: 88,
    time: '10分钟前'
  }
])

const invitationSpeeches = ref([
  {
    content: '我们门店本周末有新品发布会，特别邀请您来参加，现场有专业设计师为您提供免费的家居搭配建议。',
    score: 93,
    time: '刚刚'
  },
  {
    content: '您好，我们最近到了一批意大利进口家具，风格很符合您的喜好，邀请您来门店品鉴。',
    score: 91,
    time: '15分钟前'
  }
])

// 当前话术列表
const currentSpeeches = computed(() => {
  switch (activeTab.value) {
    case 0:
      return followSpeeches.value
    case 1:
      return objectionSpeeches.value
    case 2:
      return invitationSpeeches.value
    default:
      return []
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理标签切换
const handleTabChange = (value) => {
  activeTab.value = value
}

// 复制话术
const copySpeech = (content) => {
  // 实现复制到剪贴板功能
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(content).then(() => {
      showToast('复制成功')
    }).catch(err => {
      console.error('复制失败:', err)
      showToast('复制失败，请手动复制')
    })
  } else {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = content
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      showToast('复制成功')
    } catch (err) {
      console.error('复制失败:', err)
      showToast('复制失败，请手动复制')
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

// 发送短信
const sendSms = (content) => {
  // 实现发送短信功能
  if (selectedCustomer.value) {
    // 这里可以调用短信API，现在模拟发送
    showToast('短信已发送给' + selectedCustomer.value)
  } else {
    showToast('请先选择客户')
  }
}

// 保存到话术库
const saveToLibrary = (content) => {
  // 实现保存到话术库功能
  // 这里可以调用保存API，现在模拟保存
  showToast('已收藏到话术库')
}

// 显示提示
const showToast = (message) => {
  // 这里可以使用van-toast，现在模拟提示
  alert(message)
}

// 生成话术
const generateSpeeches = () => {
  // 这里可以实现生成话术功能
  console.log('生成话术')
}

// 确认客户选择
const confirmCustomer = (value) => {
  // 当只有一列时，value是一个数组，我们需要获取第一个元素作为索引
  const index = Array.isArray(value) ? value[0] : value
  selectedCustomer.value = customerOptions[index].text
  customerIndex.value = [index]
  showCustomerPicker.value = false
}
</script>

<style scoped>
.ai-suggestions {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background-color: var(--white);
  padding: 0 var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
}

.header-left {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
}

.header-left:hover {
  background-color: var(--bg-color);
}

.back-icon {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.header-right {
  width: 44px;
}

.customer-select {
  background-color: var(--white);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-lg);
  margin: var(--spacing-sm);
}

.speech-type {
  background-color: var(--white);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  margin: 0 var(--spacing-sm) var(--spacing-sm) var(--spacing-sm);
}

.speech-list {
  padding: 0 var(--spacing-sm);
}

.speech-item {
  background-color: var(--white);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.speech-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.speech-content {
  margin-bottom: var(--spacing-sm);
}

.speech-text {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--spacing-xs) 0;
}

.speech-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.speech-actions {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  flex-wrap: wrap;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  margin: var(--spacing-sm);
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-image {
  width: 100px;
  height: 100px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.popup-content {
  padding: var(--spacing-md);
}

.popup-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  text-align: center;
}
</style>