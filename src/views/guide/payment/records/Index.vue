<template>
  <div class="payment-records">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">收款记录</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-row">
        <van-dropdown-menu>
          <van-dropdown-item v-model="status" :options="statusOptions" placeholder="收款状态" />
          <van-dropdown-item v-model="orderNumber" :options="orderOptions" placeholder="订单" />
        </van-dropdown-menu>
      </div>
      <div class="date-filter">
        <van-cell title="时间范围" :value="dateRange" @click="showDatePicker = true" is-link />
      </div>
    </div>
    
    <!-- 收款记录列表 -->
    <div class="records-list">
      <van-cell 
        v-for="record in paymentRecords" 
        :key="record.id"
        class="record-item"
        @click="viewRecordDetail(record.id)"
      >
        <div class="record-info">
          <div class="record-header">
            <h3 class="record-title">{{ record.description }}</h3>
            <span class="record-status" :class="recordStatusClass(record.status)">
              {{ record.status }}
            </span>
          </div>
          <p class="record-meta">
            <span class="meta-item">订单号: {{ record.orderNumber }}</span>
            <span class="meta-item">客户: {{ record.customerName }}</span>
          </p>
          <p class="record-time">{{ record.createTime }}</p>
        </div>
        <div class="record-amount">¥{{ record.amount }}</div>
      </van-cell>
    </div>
    
    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-datetime-picker
        type="date"
        :range="true"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选条件
const status = ref('')
const orderNumber = ref('')
const dateRange = ref('')
const showDatePicker = ref(false)

// 筛选选项
const statusOptions = [
  { text: '待支付', value: 'pending' },
  { text: '已支付', value: 'paid' },
  { text: '已退款', value: 'refunded' }
]

const orderOptions = [
  { text: 'ORD20240101001', value: 'ORD20240101001' },
  { text: 'ORD20240101002', value: 'ORD20240101002' },
  { text: 'ORD20240101003', value: 'ORD20240101003' }
]

// 模拟收款记录数据
const paymentRecords = ref([
  {
    id: 1,
    orderNumber: 'ORD20240101001',
    customerName: '张三',
    amount: '7000',
    description: '定制衣柜预付款',
    status: '已支付',
    createTime: '2024-01-01 10:00'
  },
  {
    id: 2,
    orderNumber: 'ORD20240101001',
    customerName: '张三',
    amount: '7000',
    description: '定制衣柜尾款',
    status: '待支付',
    createTime: '2024-01-02 14:30'
  },
  {
    id: 3,
    orderNumber: 'ORD20240101002',
    customerName: '李四',
    amount: '5000',
    description: '成品沙发全款',
    status: '已支付',
    createTime: '2024-01-03 09:15'
  }
])

// 收款状态样式
const recordStatusClass = (status) => {
  switch (status) {
    case '待支付':
      return 'status-pending'
    case '已支付':
      return 'status-paid'
    case '已退款':
      return 'status-refunded'
    default:
      return ''
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 查看记录详情
const viewRecordDetail = (recordId) => {
  // 这里可以实现查看记录详情功能
  console.log('查看记录详情', recordId)
}

// 日期选择确认
const onDateConfirm = (value) => {
  dateRange.value = `${value[0].toLocaleDateString()} - ${value[1].toLocaleDateString()}`
  showDatePicker.value = false
}
</script>

<style scoped>
.payment-records {
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
  padding: 15px;
  margin-bottom: 10px;
}

.filter-row {
  margin-bottom: 10px;
}

.date-filter {
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
}

.records-list {
  background-color: white;
}

.record-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.record-info {
  flex: 1;
  margin-right: 10px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.record-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 10px;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-paid {
  background-color: #d4edda;
  color: #155724;
}

.status-refunded {
  background-color: #f8d7da;
  color: #721c24;
}

.record-meta {
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
  display: flex;
  gap: 15px;
}

.meta-item {
  flex: 1;
}

.record-time {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.record-amount {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
  text-align: right;
}
</style>