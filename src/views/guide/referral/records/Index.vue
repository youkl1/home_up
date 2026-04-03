<template>
  <div class="referral-records">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">我的转介绍</h1>
      <div class="header-right"></div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <van-dropdown-menu>
        <van-dropdown-item v-model="status" :options="statusOptions" placeholder="状态" />
        <van-dropdown-item v-model="dateRange" :options="dateOptions" placeholder="时间" />
      </van-dropdown-menu>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-item">
        <div class="stat-value">{{ totalReferrals }}</div>
        <div class="stat-label">总介绍数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ completedReferrals }}</div>
        <div class="stat-label">已成交</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalRewards }}</div>
        <div class="stat-label">总奖励</div>
      </div>
    </div>

    <!-- 转介绍记录列表 -->
    <div class="records-list">
      <div
        v-for="(record, index) in referralRecords"
        :key="index"
        class="record-item"
        @click="viewDetail(record.id)"
      >
        <div class="record-header">
          <h3 class="referrer-name">{{ record.referrerName }}</h3>
          <span :class="['status-badge', record.status]">{{ record.statusText }}</span>
        </div>
        <div class="record-content">
          <div class="info-row">
            <span class="info-label">被介绍客户:</span>
            <span class="info-value">{{ record.referredName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">介绍时间:</span>
            <span class="info-value">{{ record.referralTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">成交金额:</span>
            <span class="info-value">{{ record.dealAmount }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">奖励金额:</span>
            <span class="reward-value">{{ record.rewardAmount }}</span>
          </div>
        </div>
        <div class="record-footer">
          <span class="record-time">{{ record.createTime }}</span>
          <van-button size="small" @click.stop="viewFollowRecord(record.id)">跟进记录</van-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="referralRecords.length === 0" class="empty-state">
      <img src="/src/assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无转介绍记录</p>
      <van-button type="primary" @click="goToGeneratePoster">生成海报</van-button>
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
  { text: '待跟进', value: 'pending' },
  { text: '已成交', value: 'completed' },
  { text: '已失效', value: 'expired' }
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
const totalReferrals = ref(12)
const completedReferrals = ref(8)
const totalRewards = ref('¥3,500')

// 转介绍记录数据
const referralRecords = ref([
  {
    id: 1,
    referrerName: '老客户张三',
    referredName: '新客户李四',
    referralTime: '2026-04-01',
    dealAmount: '¥25,000',
    rewardAmount: '¥500',
    status: 'completed',
    statusText: '已成交',
    createTime: '2026-04-01 10:30'
  },
  {
    id: 2,
    referrerName: '老客户王五',
    referredName: '新客户赵六',
    referralTime: '2026-03-28',
    dealAmount: '¥18,000',
    rewardAmount: '¥500',
    status: 'completed',
    statusText: '已成交',
    createTime: '2026-03-28 14:20'
  },
  {
    id: 3,
    referrerName: '老客户刘七',
    referredName: '新客户陈八',
    referralTime: '2026-03-25',
    dealAmount: '-',
    rewardAmount: '-',
    status: 'pending',
    statusText: '待跟进',
    createTime: '2026-03-25 09:15'
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 查看详情
const viewDetail = (id) => {
  console.log('查看详情', id)
}

// 查看跟进记录
const viewFollowRecord = (id) => {
  console.log('查看跟进记录', id)
}

// 生成海报
const goToGeneratePoster = () => {
  router.push('/guide/referral/posters')
}
</script>

<style scoped>
.referral-records {
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

.stats-overview {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.records-list {
  padding: 0 15px;
}

.record-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.record-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.referrer-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
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

.status-badge.completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-badge.expired {
  background-color: #f5f5f5;
  color: #999;
}

.record-content {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #666;
  margin-right: 8px;
  min-width: 80px;
}

.info-value {
  color: #333;
  flex: 1;
}

.reward-value {
  color: #ff4d4f;
  font-weight: 500;
}

.record-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.record-time {
  font-size: 12px;
  color: #999;
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
  margin: 0 0 20px 0;
}
</style>