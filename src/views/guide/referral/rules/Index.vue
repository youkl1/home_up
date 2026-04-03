<template>
  <div class="referral-rules">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">转介绍规则</h1>
      <div class="header-right">
        <van-button size="small" @click="shareRules">分享规则</van-button>
      </div>
    </div>
    
    <!-- 活动信息 -->
    <div class="activity-info">
      <h2 class="activity-title">{{ activityInfo.title }}</h2>
      <p class="activity-desc">{{ activityInfo.description }}</p>
      <div class="activity-time">
        <span class="time-label">活动时间:</span>
        <span class="time-value">{{ activityInfo.startTime }} 至 {{ activityInfo.endTime }}</span>
      </div>
    </div>
    
    <!-- 奖励规则 -->
    <div class="section">
      <h3 class="section-title">奖励规则</h3>
      <div class="reward-list">
        <div 
          v-for="(reward, index) in activityInfo.rewards" 
          :key="index"
          class="reward-item"
        >
          <div class="reward-level">{{ reward.level }}</div>
          <div class="reward-content">
            <div class="reward-condition">{{ reward.condition }}</div>
            <div class="reward-amount">{{ reward.amount }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 发放方式 -->
    <div class="section">
      <h3 class="section-title">奖励发放方式</h3>
      <div class="distribution-methods">
        <div class="method-item">
          <span class="method-icon">💰</span>
          <span class="method-text">现金红包: 直接发放至微信零钱</span>
        </div>
        <div class="method-item">
          <span class="method-icon">🎁</span>
          <span class="method-text">实物礼品: 到店领取或快递配送</span>
        </div>
        <div class="method-item">
          <span class="method-icon">💳</span>
          <span class="method-text">购物券: 发放至会员账户</span>
        </div>
      </div>
    </div>
    
    <!-- 参与方式 -->
    <div class="section">
      <h3 class="section-title">参与方式</h3>
      <div class="participation-steps">
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">生成专属海报</div>
            <div class="step-desc">点击生成海报按钮，获取您的专属转介绍海报</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">分享给好友</div>
            <div class="step-desc">将海报分享至微信好友、朋友圈或微信群</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">好友成单</div>
            <div class="step-desc">好友通过您的海报扫码咨询并成交</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-number">4</div>
          <div class="step-content">
            <div class="step-title">获得奖励</div>
            <div class="step-desc">系统自动发放奖励至您的账户</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="primary" class="primary-btn" @click="generatePoster">生成专属海报</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 活动信息
const activityInfo = ref({
  title: '老客户转介绍奖励活动',
  description: '邀请好友购买家具，双方均可获得丰厚奖励',
  startTime: '2026-04-01',
  endTime: '2026-06-30',
  rewards: [
    { level: '一级奖励', condition: '成功介绍1位客户成交', amount: '奖励500元现金' },
    { level: '二级奖励', condition: '成功介绍3位客户成交', amount: '奖励2000元现金+精美礼品' },
    { level: '三级奖励', condition: '成功介绍5位客户成交', amount: '奖励5000元现金+豪华礼品' }
  ]
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 分享规则
const shareRules = () => {
  // 这里可以实现分享规则功能
  console.log('分享规则')
}

// 生成海报
const generatePoster = () => {
  router.push('/guide/referral/posters')
}
</script>

<style scoped>
.referral-rules {
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
  width: 80px;
}

.activity-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 15px;
  color: white;
}

.activity-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.activity-desc {
  font-size: 14px;
  margin: 0 0 15px 0;
  opacity: 0.9;
}

.activity-time {
  font-size: 12px;
  opacity: 0.8;
}

.time-label {
  margin-right: 5px;
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

.reward-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.reward-level {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  min-width: 70px;
}

.reward-content {
  flex: 1;
}

.reward-condition {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.reward-amount {
  font-size: 12px;
  color: #ff4d4f;
  font-weight: 500;
}

.distribution-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
}

.method-icon {
  font-size: 20px;
}

.participation-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.step-number {
  width: 28px;
  height: 28px;
  background-color: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  color: #666;
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