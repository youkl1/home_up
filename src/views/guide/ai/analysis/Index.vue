<template>
  <div class="ai-analysis">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">客户意向分析</h1>
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
    
    <!-- 意向等级 -->
    <div class="intent-section">
      <h3 class="section-title">意向等级</h3>
      <div class="intent-level">
        <div class="level-indicator">
          <div class="level-bar">
            <div class="level-fill" :style="{ width: customerAnalysis.intentLevel + '%' }"></div>
          </div>
          <span class="level-text">{{ customerAnalysis.intentLevel }}%</span>
        </div>
        <div class="level-label">{{ customerAnalysis.intentLabel }}</div>
      </div>
    </div>
    
    <!-- 意向产品 -->
    <div class="section">
      <h3 class="section-title">意向产品</h3>
      <div class="product-tags">
        <span 
          v-for="(product, index) in customerAnalysis.interestedProducts" 
          :key="index"
          class="product-tag"
        >
          {{ product }}
        </span>
      </div>
    </div>
    
    <!-- 需求痛点 -->
    <div class="section">
      <h3 class="section-title">需求痛点</h3>
      <div class="pain-points">
        <div 
          v-for="(pain, index) in customerAnalysis.painPoints" 
          :key="index"
          class="pain-item"
        >
          <span class="pain-index">{{ index + 1 }}</span>
          <span class="pain-text">{{ pain }}</span>
        </div>
      </div>
    </div>
    
    <!-- 浏览轨迹 -->
    <div class="section">
      <h3 class="section-title">浏览轨迹</h3>
      <div class="browse-tracks">
        <div 
          v-for="(track, index) in customerAnalysis.browseTracks" 
          :key="index"
          class="track-item"
        >
          <div class="track-time">{{ track.time }}</div>
          <div class="track-content">
            <span class="track-action">{{ track.action }}</span>
            <span class="track-target">{{ track.target }}</span>
          </div>
          <div class="track-duration">{{ track.duration }}</div>
        </div>
      </div>
    </div>
    
    <!-- 分析建议 -->
    <div class="section">
      <h3 class="section-title">跟进建议</h3>
      <div class="suggestions">
        <div 
          v-for="(suggestion, index) in customerAnalysis.suggestions" 
          :key="index"
          class="suggestion-item"
        >
          <span class="suggestion-index">{{ index + 1 }}</span>
          <span class="suggestion-text">{{ suggestion }}</span>
        </div>
      </div>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 客户选择
const selectedCustomer = ref('')
const showCustomerPicker = ref(false)
const customerIndex = ref(0)
const customerOptions = ['张三', '李四', '王五', '赵六']

// 客户分析数据
const customerAnalysis = reactive({
  intentLevel: 85,
  intentLabel: '高意向',
  interestedProducts: ['现代风格沙发', '定制衣柜', '餐桌椅套装'],
  painPoints: [
    '对价格比较敏感，需要优惠方案',
    '担心产品质量和售后服务',
    '希望尽快确定方案，时间紧迫'
  ],
  browseTracks: [
    { time: '今天 14:30', action: '浏览', target: '现代风格沙发', duration: '5分钟' },
    { time: '今天 14:25', action: '查看详情', target: '定制衣柜', duration: '8分钟' },
    { time: '昨天 16:20', action: '收藏', target: '餐桌椅套装', duration: '3分钟' },
    { time: '昨天 10:15', action: '咨询', target: '客厅家具', duration: '12分钟' }
  ],
  suggestions: [
    '客户意向度较高，建议尽快跟进',
    '重点介绍产品质量和售后保障',
    '提供限时优惠方案，促进成交',
    '邀请客户到店体验实物产品'
  ]
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 确认客户选择
const confirmCustomer = (value) => {
  selectedCustomer.value = value
  showCustomerPicker.value = false
  // 这里可以根据选择的客户加载对应的分析数据
  console.log('选择客户', value)
}
</script>

<style scoped>
.ai-analysis {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
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

.customer-select {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
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

.intent-section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.intent-level {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-bar {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.level-text {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  min-width: 40px;
}

.level-label {
  font-size: 14px;
  color: #52c41a;
  font-weight: 500;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-tag {
  padding: 6px 12px;
  background-color: #f0f0ff;
  color: #667eea;
  border-radius: 16px;
  font-size: 14px;
}

.pain-points {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pain-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.pain-index {
  width: 20px;
  height: 20px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.pain-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.browse-tracks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.track-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.track-item:last-child {
  border-bottom: none;
}

.track-time {
  font-size: 12px;
  color: #999;
  min-width: 70px;
}

.track-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-action {
  font-size: 14px;
  color: #667eea;
}

.track-target {
  font-size: 12px;
  color: #666;
}

.track-duration {
  font-size: 12px;
  color: #999;
}

.suggestions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.suggestion-index {
  width: 20px;
  height: 20px;
  background-color: #52c41a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.suggestion-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.popup-content {
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}
</style>