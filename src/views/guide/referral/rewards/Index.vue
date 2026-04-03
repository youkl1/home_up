<template>
  <div class="referral-rewards">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">奖励明细</h1>
      <div class="header-right"></div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <van-dropdown-menu>
        <van-dropdown-item v-model="status" :options="statusOptions" placeholder="发放状态" />
        <van-dropdown-item v-model="dateRange" :options="dateOptions" placeholder="时间" />
      </van-dropdown-menu>
    </div>

    <!-- 奖励统计 -->
    <div class="rewards-summary">
      <div class="summary-item">
        <div class="summary-value">{{ totalPending }}</div>
        <div class="summary-label">待发放</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">{{ totalPaid }}</div>
        <div class="summary-label">已发放</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">{{ totalAmount }}</div>
        <div class="summary-label">累计奖励</div>
      </div>
    </div>

    <!-- 奖励列表 -->
    <div class="rewards-list">
      <div
        v-for="(reward, index) in rewardsList"
        :key="index"
        class="reward-item"
      >
        <div class="reward-header">
          <div class="reward-type">
            <span class="type-icon">{{ reward.type === 'cash' ? '💰' : '🎁' }}</span>
            <span class="type-name">{{ reward.typeName }}</span>
          </div>
          <span :class="['status-badge', reward.status]">{{ reward.statusText }}</span>
        </div>
        <div class="reward-content">
          <div class="reward-amount">{{ reward.amount }}</div>
          <div class="reward-desc">{{ reward.description }}</div>
        </div>
        <div class="reward-footer">
          <span class="reward-time">{{ reward.createTime }}</span>
          <span v-if="reward.paidTime" class="paid-time">发放时间: {{ reward.paidTime }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="rewardsList.length === 0" class="empty-state">
      <img src="/src/assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无奖励明细</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态选项
const statusOptions = [
  { text: '全部', value: 'all' },
  { text: '待发放', value: 'pending' },
  { text: '已发放', value: 'paid' }
]

// 日期选项
const dateOptions = [
  { text: '全部时间', value: 'all' },
  { text: '本月', value: 'month' },
  { text: '本季度', value: 'quarter' },
  { text: '本年', value: 'year' }
]

// 当前筛选条件
const status = ref('all')
const dateRange = ref('all')

// 统计数据
const totalPending = ref('¥1,000')
const totalPaid = ref('¥2,500')
const totalAmount = ref('¥3,500')

// 奖励列表数据
const rewardsList = ref([
  {
    id: 1,
    type: 'cash',
    typeName: '现金奖励',
    amount: '¥500',
    description: '老客户张三介绍新客户李四成交奖励',
    status: 'paid',
    statusText: '已发放',
    createTime: '2026-04-01',
    paidTime: '2026-04-02'
  },
  {
    id: 2,
    type: 'cash',
    typeName: '现金奖励',
    amount: '¥500',
    description: '老客户王五介绍新客户赵六成交奖励',
    status: 'paid',
    statusText: '已发放',
    createTime: '2026-03-28',
    paidTime: '2026-03-29'
  },
  {
    id: 3,
    type: 'gift',
    typeName: '实物礼品',
    amount: '精美礼品一份',
    description: '累计介绍3位客户成交奖励',
    status: 'pending',
    statusText: '待发放',
    createTime: '2026-03-25',
    paidTime: null
  },
  {
    id: 4,
    type: 'cash',
    typeName: '现金奖励',
    amount: '¥500',
    description: '老客户刘七介绍新客户陈八成交奖励',
    status: 'pending',
    statusText: '待发放',
    createTime: '2026-03-20',
    paidTime: null
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.referral-rewards {
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

.filter-section {
  background-color: white;
  padding: 10px 15px;
  margin-bottom: 10px;
}

.rewards-summary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 15px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-item {
  flex: 1;
  text-align: center;
  color: white;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.summary-label {
  font-size: 12px;
  opacity: 0.9;
}

.rewards-list {
  padding: 0 15px;
}

.reward-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.reward-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.reward-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-icon {
  font-size: 20px;
}

.type-name {
  font-size: 14px;
  color: #333;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-badge.pending {
  background-color: #fff2e8;
  color: #fa8c16;
}

.status-badge.paid {
  background-color: #f6ffed;
  color: #52c41a;
}

.reward-content {
  margin-bottom: 12px;
}

.reward-amount {
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
  margin-bottom: 8px;
}

.reward-desc {
  font-size: 14px;
  color: #666;
}

.reward-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.reward-time {
  font-size: 12px;
  color: #999;
}

.paid-time {
  font-size: 12px;
  color: #52c41a;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0;
}
</style>