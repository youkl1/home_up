<template>
  <div class="ticket-detail">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">工单详情</h1>
      <div class="header-right">
        <van-button size="small" @click="followTicket">跟进</van-button>
      </div>
    </div>
    
    <!-- 工单状态 -->
    <div class="status-section">
      <div class="status-badge" :class="ticketStatusClass(ticket.status)">
        {{ ticket.status }}
      </div>
      <p class="status-desc">{{ ticket.statusDesc }}</p>
    </div>
    
    <!-- 工单基本信息 -->
    <div class="info-section">
      <h3 class="section-title">基本信息</h3>
      <div class="info-item">
        <span class="info-label">工单号</span>
        <span class="info-value">{{ ticket.ticketNumber }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">工单类型</span>
        <span class="info-value">{{ ticket.type }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">创建时间</span>
        <span class="info-value">{{ ticket.createTime }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">预计完成时间</span>
        <span class="info-value">{{ ticket.expectedTime }}</span>
      </div>
    </div>
    
    <!-- 客户信息 -->
    <div class="info-section">
      <h3 class="section-title">客户信息</h3>
      <div class="info-item">
        <span class="info-label">客户姓名</span>
        <span class="info-value">{{ ticket.customerName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">联系电话</span>
        <span class="info-value phone">{{ ticket.customerPhone }}</span>
        <van-button size="small" type="primary" class="call-btn" @click="callCustomer">
          拨打
        </van-button>
      </div>
      <div class="info-item">
        <span class="info-label">联系地址</span>
        <span class="info-value">{{ ticket.customerAddress }}</span>
      </div>
    </div>
    
    <!-- 订单信息 -->
    <div class="info-section">
      <h3 class="section-title">订单信息</h3>
      <div class="info-item">
        <span class="info-label">订单编号</span>
        <span class="info-value">{{ ticket.orderNumber }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">产品名称</span>
        <span class="info-value">{{ ticket.productName }}</span>
      </div>
    </div>
    
    <!-- 工单内容 -->
    <div class="info-section">
      <h3 class="section-title">工单内容</h3>
      <div class="ticket-content">
        {{ ticket.content }}
      </div>
    </div>
    
    <!-- 处理师傅信息 -->
    <div class="info-section">
      <h3 class="section-title">处理师傅</h3>
      <div class="info-item">
        <span class="info-label">师傅姓名</span>
        <span class="info-value">{{ ticket.workerName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">联系电话</span>
        <span class="info-value phone">{{ ticket.workerPhone }}</span>
        <van-button size="small" type="primary" class="call-btn" @click="callWorker">
          拨打
        </van-button>
      </div>
    </div>
    
    <!-- 处理进度 -->
    <div class="info-section">
      <h3 class="section-title">处理进度</h3>
      <div class="progress-steps">
        <div 
          v-for="(step, index) in ticket.processSteps" 
          :key="index"
          class="progress-step"
          :class="{ active: step.status === 'completed' || step.status === 'current' }"
        >
          <div class="step-icon">{{ index + 1 }}</div>
          <div class="step-content">
            <h4 class="step-title">{{ step.title }}</h4>
            <p class="step-time">{{ step.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 工单数据
const ticket = ref({
  id: route.params.id || 1,
  ticketNumber: 'TK20240101001',
  type: '安装工单',
  status: '待处理',
  statusDesc: '工单已创建，等待分配师傅',
  createTime: '2024-01-01 10:00',
  expectedTime: '2024-01-05 14:00',
  customerName: '张三',
  customerPhone: '13800138000',
  customerAddress: '北京市朝阳区某某街道123号',
  orderNumber: 'ORD20240101001',
  productName: '定制衣柜',
  content: '客户需要安装定制衣柜，地址在北京市朝阳区某某街道123号，预约时间为1月5日下午14:00',
  workerName: '王师傅',
  workerPhone: '13900139000',
  processSteps: [
    {
      title: '工单创建',
      time: '2024-01-01 10:00',
      status: 'completed'
    },
    {
      title: '分配师傅',
      time: '',
      status: 'pending'
    },
    {
      title: '上门服务',
      time: '',
      status: 'pending'
    },
    {
      title: '服务完成',
      time: '',
      status: 'pending'
    }
  ]
})

// 工单状态样式
const ticketStatusClass = (status) => {
  switch (status) {
    case '待处理':
      return 'status-pending'
    case '处理中':
      return 'status-processing'
    case '已完成':
      return 'status-completed'
    case '已取消':
      return 'status-cancelled'
    default:
      return ''
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跟进工单
const followTicket = () => {
  router.push(`/guide/tickets/follow/${ticket.value.id}`)
}

// 拨打客户电话
const callCustomer = () => {
  // 这里可以实现拨打客户电话功能
  console.log('拨打客户电话', ticket.value.customerPhone)
}

// 拨打师傅电话
const callWorker = () => {
  // 这里可以实现拨打师傅电话功能
  console.log('拨打师傅电话', ticket.value.workerPhone)
}
</script>

<style scoped>
.ticket-detail {
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
  width: 60px;
}

.status-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 10px;
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cce7ff;
  color: #004085;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.info-section {
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

.info-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  font-size: 14px;
  color: #666;
  width: 80px;
}

.info-value {
  font-size: 14px;
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.info-value.phone {
  color: #667eea;
}

.call-btn {
  border-radius: 15px;
  font-size: 12px;
  padding: 2px 10px;
}

.ticket-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.progress-steps {
  margin-top: 10px;
}

.progress-step {
  display: flex;
  margin-bottom: 20px;
  position: relative;
}

.progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 24px;
  bottom: -20px;
  width: 2px;
  background-color: #e0e0e0;
}

.progress-step.active:not(:last-child)::after {
  background-color: #667eea;
}

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}

.progress-step.active .step-icon {
  background-color: #667eea;
  color: white;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.step-time {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.progress-step.active .step-title {
  color: #667eea;
}
</style>