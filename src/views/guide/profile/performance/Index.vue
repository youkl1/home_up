<template>
  <div class="performance-page">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">我的业绩</h1>
      <div class="nav-icons">
        <div class="nav-icon order" @click="navigateTo('订单')"></div>
        <div class="nav-icon payment" @click="navigateTo('收款')"></div>
        <div class="nav-icon contract" @click="navigateTo('合同')"></div>
        <div class="nav-icon ticket" @click="navigateTo('工单')"></div>
        <div class="nav-icon filter" @click="showFilter"></div>
      </div>
    </div>
    
    <!-- 业绩概览 -->
    <div class="performance-overview card mt-4 px-4">
      <h3 class="section-title">本月业绩概览</h3>
      <div class="overview-grid">
        <div class="overview-item">
          <div class="overview-value">¥{{ formatNumber(performanceData.monthlySales) }}</div>
          <div class="overview-label">本月销售额</div>
        </div>
        <div class="overview-item">
          <div class="overview-value">{{ performanceData.orderCount }}</div>
          <div class="overview-label">订单数量</div>
        </div>
        <div class="overview-item">
          <div class="overview-value">{{ performanceData.customerCount }}</div>
          <div class="overview-label">新增客户</div>
        </div>
        <div class="overview-item">
          <div class="overview-value">{{ performanceData.completionRate }}%</div>
          <div class="overview-label">目标完成率</div>
        </div>
      </div>
    </div>
    
    <!-- 业绩趋势 -->
    <div class="performance-trend card mt-4 px-4">
      <h3 class="section-title">业绩趋势</h3>
      <div class="trend-chart">
        <div v-for="(item, index) in trendData" :key="index" class="trend-bar">
          <div class="bar-fill" :style="{ height: item.percentage + '%' }"></div>
          <div class="bar-label">{{ item.month }}</div>
          <div class="bar-value">{{ item.value }}万</div>
        </div>
      </div>
    </div>
    
    <!-- 业绩明细 -->
    <div class="performance-detail card mt-4 px-4">
      <h3 class="section-title">业绩明细</h3>
      <div class="detail-list">
        <div v-for="item in detailList" :key="item.id" class="detail-item">
          <div class="detail-info">
            <div class="detail-name">{{ item.customerName }}</div>
            <div class="detail-product">{{ item.product }}</div>
            <div class="detail-time">{{ item.time }}</div>
          </div>
          <div class="detail-amount">+¥{{ formatNumber(item.amount) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 业绩数据
const performanceData = ref({
  monthlySales: 285000,
  orderCount: 12,
  customerCount: 8,
  completionRate: 95
})

// 趋势数据
const trendData = ref([
  { month: '1月', value: 18, percentage: 60 },
  { month: '2月', value: 22, percentage: 73 },
  { month: '3月', value: 25, percentage: 83 },
  { month: '4月', value: 28.5, percentage: 95 }
])

// 业绩明细
const detailList = ref([
  {
    id: 1,
    customerName: '张女士',
    product: '现代简约橱柜',
    amount: 45000,
    time: '2026-04-01 14:30'
  },
  {
    id: 2,
    customerName: '李先生',
    product: '全屋定制方案',
    amount: 68000,
    time: '2026-03-31 10:15'
  },
  {
    id: 3,
    customerName: '王女士',
    product: '欧式衣柜',
    amount: 32000,
    time: '2026-03-30 16:45'
  },
  {
    id: 4,
    customerName: '赵先生',
    product: '别墅整体方案',
    amount: 120000,
    time: '2026-03-29 09:20'
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 显示筛选
const showFilter = () => {
  alert('筛选功能开发中')
}

// 导航到对应页面
const navigateTo = (path) => {
  const pathMap = {
    '订单': '/guide/payment/records',
    '收款': '/guide/payment/records',
    '合同': '/guide/contracts/list',
    '工单': '/guide/tickets/list'
  }
  router.push(pathMap[path] || '/guide/profile/performance')
}

// 格式化数字
const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}
</script>

<style scoped>
.performance-page {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
  padding-bottom: 20px;
}

.top-nav {
  width: 375px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 auto;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.nav-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.nav-icon.back {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>');
}

.nav-icon.filter {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>');
}

.nav-icon.order {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.nav-icon.payment {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>');
}

.nav-icon.contract {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.nav-icon.ticket {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>');
}

.performance-overview,
.performance-trend,
.performance-detail {
  padding: var(--spacing-md);
  margin: 0 auto;
  width: 375px;
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.overview-item {
  text-align: center;
  padding: var(--spacing-md);
  background-color: #F9FAFC;
  border-radius: var(--border-radius-md);
}

.overview-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.overview-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.trend-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 150px;
  padding: var(--spacing-md) 0;
}

.trend-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-fill {
  width: 30px;
  background-color: var(--primary-color);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.bar-value {
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  margin-top: 2px;
}

.detail-list {
  padding-top: var(--spacing-sm);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color-light);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-info {
  flex: 1;
}

.detail-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.detail-product {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.detail-time {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.detail-amount {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: var(--success-color);
}

@media screen and (max-width: 375px) {
  .performance-overview,
  .performance-trend,
  .performance-detail {
    width: 100%;
  }
}
</style>